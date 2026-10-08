(function (root, factory) {
  "use strict";
  const model = factory();
  if (typeof module === "object" && module.exports) module.exports = model;
  else root.KMA_SYNC_MODEL = model;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const subjects = ["ktvxl", "tthcm", "vldc", "xstk"];
  const studySubjects = subjects.concat(["gdtc", "other"]);
  const keys = subjects
    .flatMap((s) => [
      "kma_user_answers_" + s + "_v2",
      "kma_starred_questions_" + s + "_v2",
    ])
    .concat(["kma_question_notes_v1", "kma_study_logs_v1"]);
  const colors = new Set([
    "yellow",
    "orange",
    "pink",
    "green",
    "blue",
    "purple",
  ]);
  const plain = (value) =>
    value && typeof value === "object" && !Array.isArray(value);
  const idOK = (value) =>
    typeof value === "string" &&
    /^[\w.-]{1,100}$/.test(value) &&
    !["__proto__", "prototype", "constructor"].includes(value);
  const operationId = () =>
    typeof crypto === "object" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  function parse(raw, fallback) {
    try {
      return typeof raw === "string" && raw.length < 7000000
        ? JSON.parse(raw)
        : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function rid(kind, subject, id) {
    return kind + "|" + subject + "|" + encodeURIComponent(id);
  }
  function flatten(key, raw) {
    const records = {};
    if (!keys.includes(key)) return records;
    const data = parse(raw, null);
    const match = key.match(
      /^kma_(user_answers|starred_questions)_(ktvxl|tthcm|vldc|xstk)_v2$/,
    );
    if (match) {
      const kind = match[1] === "user_answers" ? "answer" : "star",
        subject = match[2];
      if (kind === "star" && Array.isArray(data)) {
        for (const id of data.slice(0, 3000).map(String).filter(idOK))
          records[rid(kind, subject, id)] = { kind, subject, id, value: true };
      } else if (kind === "answer" && plain(data)) {
        for (const [id, answer] of Object.entries(data).slice(0, 3000)) {
          if (
            !idOK(id) ||
            !plain(answer) ||
            typeof answer.isCorrect !== "boolean"
          )
            continue;
          const value = { isCorrect: answer.isCorrect };
          if (typeof answer.answer === "string")
            value.answer = answer.answer.slice(0, 100);
          else if (
            typeof answer.answer === "number" &&
            Number.isFinite(answer.answer)
          )
            value.answer = answer.answer;
          if (typeof answer.inputVal === "string")
            value.inputVal = answer.inputVal.slice(0, 2000);
          records[rid(kind, subject, id)] = { kind, subject, id, value };
        }
      }
    } else if (
      key === "kma_question_notes_v1" &&
      plain(data) &&
      data.version === 1 &&
      Array.isArray(data.notes)
    ) {
      for (const note of data.notes.slice(0, 2500)) {
        if (
          !plain(note) ||
          !subjects.includes(note.subject) ||
          !idOK(String(note.questionId)) ||
          typeof note.text !== "string" ||
          !note.text.trim()
        )
          continue;
        const id = String(note.questionId);
        const value = {
          subject: note.subject,
          questionId: id,
          text: note.text.normalize("NFC").slice(0, 2000),
          color: colors.has(note.color) ? note.color : "yellow",
          updatedAt: Number.isSafeInteger(note.updatedAt) ? note.updatedAt : 0,
        };
        records[rid("note", note.subject, id)] = {
          kind: "note",
          subject: note.subject,
          id,
          value,
        };
      }
    } else if (key === "kma_study_logs_v1" && plain(data)) {
      for (const [date, bySubject] of Object.entries(data).slice(0, 1500)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !plain(bySubject)) continue;
        for (const subject of studySubjects) {
          const minutes = bySubject[subject];
          if (!Number.isFinite(minutes) || minutes <= 0) continue;
          records[rid("study", subject, date)] = {
            kind: "study",
            subject,
            id: date,
            value: Math.min(100000, minutes),
          };
        }
      }
    }
    return records;
  }
  function equivalent(a, b, kind) {
    if (kind === "note" && a && b)
      return a.text === b.text && a.color === b.color;
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function diff(key, before, after, versions) {
    const old = flatten(key, before),
      next = flatten(key, after),
      ops = [];
    for (const id of new Set(Object.keys(old).concat(Object.keys(next)))) {
      const entry = next[id] || old[id],
        value = next[id] ? next[id].value : null;
      const previous = old[id] ? old[id].value : null;
      if (equivalent(previous, value, entry.kind)) continue;
      const op = {
        ...entry,
        rid: id,
        value,
        baseVersion: versions[id] || 0,
        opId: operationId(),
      };
      if (entry.kind === "study") op.delta = (value || 0) - (previous || 0);
      ops.push(op);
    }
    return ops;
  }
  function queueMerge(queue, incoming) {
    const result = queue.map((x) => ({ ...x }));
    for (const op of incoming) {
      const at = result.findIndex((x) => x.rid === op.rid),
        prev = result[at];
      const value = prev
        ? { ...op, baseVersion: prev.baseVersion, opId: prev.opId }
        : { ...op };
      if (op.kind === "study" && prev) value.delta = prev.delta + op.delta;
      if (at < 0) result.push(value);
      else result[at] = value;
    }
    return result;
  }
  function reconcile(records, queue, revision, previousAcknowledged) {
    const result = { ...records },
      conflicts = [],
      accepted = [],
      acknowledged = new Set(previousAcknowledged || []);
    for (const op of queue) {
      if (op.opId && acknowledged.has(op.opId)) {
        accepted.push(op.rid);
        continue;
      }
      const previous = result[op.rid];
      if (
        op.kind === "note" &&
        (previous?.version || 0) !== op.baseVersion &&
        !equivalent(previous?.value || null, op.value, "note")
      ) {
        conflicts.push({ op, remote: previous || null });
        continue;
      }
      const value =
        op.kind === "study"
          ? Math.max(0, (previous?.value || 0) + op.delta)
          : op.value;
      if (!equivalent(previous?.value || null, value, op.kind))
        result[op.rid] = {
          kind: op.kind,
          subject: op.subject,
          id: op.id,
          value,
          version: ++revision,
        };
      accepted.push(op.rid);
      if (op.opId) acknowledged.add(op.opId);
    }
    return {
      records: result,
      revision,
      conflicts,
      accepted,
      acknowledged: [...acknowledged].slice(-15000),
    };
  }
  function project(records, queue) {
    const merged = { ...records };
    for (const op of queue) merged[op.rid] = { ...op };
    const payload = {};
    for (const subject of subjects) {
      payload["kma_user_answers_" + subject + "_v2"] = {};
      payload["kma_starred_questions_" + subject + "_v2"] = [];
    }
    payload.kma_question_notes_v1 = { version: 1, notes: [] };
    payload.kma_study_logs_v1 = {};
    for (const entry of Object.values(merged)) {
      if (
        !entry ||
        entry.value === null ||
        !(entry.kind === "study" ? studySubjects : subjects).includes(
          entry.subject,
        ) ||
        !idOK(entry.id)
      )
        continue;
      if (
        entry.kind === "answer" &&
        (!plain(entry.value) || typeof entry.value.isCorrect !== "boolean")
      )
        continue;
      if (
        entry.kind === "note" &&
        (!plain(entry.value) ||
          typeof entry.value.text !== "string" ||
          entry.value.text.length > 2000)
      )
        continue;
      if (
        entry.kind === "study" &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(entry.id) || !Number.isFinite(entry.value))
      )
        continue;
      if (entry.kind === "answer")
        payload["kma_user_answers_" + entry.subject + "_v2"][entry.id] =
          entry.value;
      else if (entry.kind === "star" && entry.value)
        payload["kma_starred_questions_" + entry.subject + "_v2"].push(
          entry.id,
        );
      else if (entry.kind === "note")
        payload.kma_question_notes_v1.notes.push(entry.value);
      else if (entry.kind === "study" && entry.value > 0) {
        if (!payload.kma_study_logs_v1[entry.id])
          payload.kma_study_logs_v1[entry.id] = {};
        payload.kma_study_logs_v1[entry.id][entry.subject] = entry.value;
      }
    }
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]),
    );
  }
  function counts(records) {
    const result = { answers: 0, stars: 0, notes: 0, minutes: 0 };
    for (const r of Object.values(records)) {
      if (!r || r.value === null) continue;
      if (r.kind === "answer") result.answers++;
      if (r.kind === "star" && r.value) result.stars++;
      if (r.kind === "note") result.notes++;
      if (r.kind === "study") result.minutes += +r.value || 0;
    }
    return result;
  }
  return {
    keys,
    subjects,
    flatten,
    diff,
    queueMerge,
    reconcile,
    project,
    counts,
    parse,
    rid,
    operationId,
  };
});
