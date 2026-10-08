const { PGlite } = require("@electric-sql/pglite");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
(async () => {
  const db = new PGlite(),
    a = "11111111-1111-4111-8111-111111111111",
    b = "22222222-2222-4222-8222-222222222222";
  await db.exec(
    `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;insert into auth.users values('${a}'),('${b}');`,
  );
  const sql = (name) =>
    fs.readFileSync(
      path.join(__dirname, "../supabase/migrations/" + name),
      "utf8",
    );
  await db.exec(sql("202610080001_study_sync.sql"));
  const login = async (id) => {
    await db.exec("reset role;set role authenticated;");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  };
  const rpc = async (name, args = []) =>
    (
      await db.query(
        "select public." +
          name +
          "(" +
          args.map((_, i) => "$" + (i + 1)).join(",") +
          ") data",
        args,
      )
    ).rows[0].data;
  await login(a);
  await rpc("study_snapshot");
  let old = await rpc("study_focus_start", ["ktvxl", 60]);
  await db.exec("reset role");
  await db.query(
    "update public.focus_sessions set state='cancelled',elapsed_seconds=1553.911783,ended_at=clock_timestamp(),resumed_at=null where id=$1",
    [old.id],
  );
  await db.exec(sql("202610080002_focus_reliability.sql"));
  await login(a);
  let board = await rpc("study_leaderboard", ["today", "all"]);
  assert.equal(
    board.me.minutes,
    25,
    "cancelled legacy session must recover only server-measured whole minutes",
  );
  assert.equal(board.me.rank, 1);
  assert.equal(board.rows[0].minutes, 25);
  assert.equal((await rpc("study_snapshot")).profile.leaderboard_opt_in, true);
  await rpc("study_set_profile", ["Test A", false]);
  assert.equal(
    (await rpc("study_leaderboard")).me.joined,
    true,
    "old clients must not accidentally opt users out",
  );
  let s = await rpc("study_focus_start", ["ktvxl", 60]);
  await assert.rejects(() => rpc("study_focus_start", ["ktvxl", 301]));
  assert.equal(
    (await rpc("study_focus_start", ["ktvxl", 60])).id,
    s.id,
    "lost start response creates duplicate session",
  );
  await assert.rejects(() => rpc("study_focus_start", ["vldc", 60]));
  assert.equal((await rpc("study_focus_current")).id, s.id);
  await login(b);
  assert.equal(await rpc("study_focus_current"), null);
  await assert.rejects(() => rpc("study_focus_action", [s.id, "finish"]));
  assert.equal(
    (await rpc("study_snapshot")).profile.leaderboard_opt_in,
    true,
    "new users join automatically",
  );
  await login(a);
  await assert.rejects(() =>
    db.query(
      "update public.focus_sessions set elapsed_seconds=3600 where id=$1",
      [s.id],
    ),
  );
  let early = await rpc("study_focus_action", [s.id, "finish"]);
  assert.equal(
    early.credited_minutes,
    0,
    "an immediate finish cannot mint minutes",
  );
  s = await rpc("study_focus_start", ["ktvxl", 60]);
  await db.exec("reset role");
  await db.query(
    "update public.focus_sessions set elapsed_seconds=3600 where id=$1",
    [s.id],
  );
  await login(a);
  let done = await rpc("study_focus_action", [s.id, "finish"]);
  assert.equal(done.credited_minutes, 60);
  await rpc("study_focus_action", [s.id, "finish"]);
  assert.equal(
    (await rpc("study_leaderboard", ["today", "all"])).me.minutes,
    85,
    "retry doubled completed credit",
  );
  assert.equal(await rpc("study_focus_current"), null);
  s = await rpc("study_focus_start", ["vldc", 60]);
  await db.exec("reset role");
  await db.query(
    "update public.focus_sessions set elapsed_seconds=125 where id=$1",
    [s.id],
  );
  await login(a);
  await rpc("study_focus_action", [s.id, "pause"]);
  assert.equal((await rpc("study_focus_current")).state, "paused");
  done = await rpc("study_focus_action", [s.id, "finish"]);
  assert.equal(done.credited_minutes, 2, "early stop lost real minutes");
  assert.equal(
    (await rpc("study_leaderboard", ["today", "vldc"])).me.minutes,
    2,
  );
  s = await rpc("study_focus_start", ["xstk", 1]);
  await db.exec("reset role");
  await db.query(
    "update public.focus_sessions set elapsed_seconds=6000 where id=$1",
    [s.id],
  );
  await login(a);
  done = await rpc("study_focus_action", [s.id, "cancel"]);
  assert.equal(
    done.credited_minutes,
    1,
    "cannot credit beyond planned duration",
  );
  await rpc("study_focus_action", [s.id, "cancel"]);
  assert.equal(
    (await rpc("study_leaderboard", ["today", "xstk"])).me.minutes,
    1,
  );
  await db.exec("reset role");
  await db.exec(sql("202610080002_focus_reliability.sql"));
  await login(a);
  assert.equal(
    (await rpc("study_leaderboard", ["today", "all"])).me.minutes,
    88,
    "migration rerun changed credit",
  );
  await db.close();
  console.log(
    "PASS: migration 002, automatic ranking, cancelled session recovery, partial/60-minute credit, retry, cap, active-session recovery and account isolation.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
