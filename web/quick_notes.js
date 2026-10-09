/**
 * Sổ tay ghi chú kiến thức nhanh (Quick Knowledge Notes)
 * Cho phép ghi chú theo môn học hoặc ghi chú chung, hỗ trợ Markdown, xem trước (Preview),
 * render công thức toán KaTeX, lưu trữ tự động, tìm kiếm, chỉnh sửa.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "kma_quick_notes_v1";
  const PIN_KEY = "kma_quick_notes_pinned";

  const SUBJECT_MAP = {
    all: "Tất cả",
    general: "📌 Chung",
    ktvxl: "⚡ Vi Xử Lý",
    tthcm: "📕 TT HCM",
    vldc: "⚛️ Vật Lý ĐC",
    xstk: "🎲 XS Thống Kê",
  };

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Markdown Parser hỗ trợ KaTeX, bảng, danh sách, checklist, code block, quote, heading
   */
  function renderMarkdown(md) {
    if (!md || typeof md !== "string") return "";

    // 1. Bảo vệ khối công thức toán KaTeX: $$...$$, $...$, \[...\], \(...\)
    const mathHolders = [];
    let text = md.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, (m) => {
      mathHolders.push(m);
      return "@@MATH_" + (mathHolders.length - 1) + "@@";
    });

    // 2. Bảo vệ khối code có hàng rào (fenced code blocks ```...```)
    const codeBlocks = [];
    text = text.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
      codeBlocks.push(
        '<pre class="note-code-block"><code class="lang-' +
          escapeHtml(lang) +
          '">' +
          escapeHtml(code.trimEnd()) +
          "</code></pre>"
      );
      return "@@CODEBLOCK_" + (codeBlocks.length - 1) + "@@";
    });

    // 3. Phân tích từng dòng
    const lines = text.split("\n");
    const out = [];
    let inUl = false,
      inOl = false,
      inTable = false,
      inBlockquote = false;
    let tableRows = [];

    function closeLists() {
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
    }

    function closeTable() {
      if (inTable) {
        if (tableRows.length > 0) {
          let tableHtml = '<div class="note-table-wrapper"><table class="note-md-table">';
          tableRows.forEach((row, idx) => {
            const cells = row.split("|").slice(1, -1).map((c) => c.trim());
            if (idx === 0) {
              tableHtml +=
                "<thead><tr>" +
                cells.map((c) => "<th>" + formatInline(c) + "</th>").join("") +
                "</tr></thead><tbody>";
            } else if (idx === 1 && cells.every((c) => /^:?-+:?$/.test(c))) {
              // Hàng phân cách, bỏ qua
            } else {
              tableHtml +=
                "<tr>" +
                cells.map((c) => "<td>" + formatInline(c) + "</td>").join("") +
                "</tr>";
            }
          });
          tableHtml += "</tbody></table></div>";
          out.push(tableHtml);
        }
        tableRows = [];
        inTable = false;
      }
    }

    function closeBlockquote() {
      if (inBlockquote) {
        out.push("</blockquote>");
        inBlockquote = false;
      }
    }

    function formatInline(str) {
      let s = escapeHtml(str);
      // Inline code
      s = s.replace(/`([^`]+)`/g, '<code class="note-inline-code">$1</code>');
      // Highlights: ==text==
      s = s.replace(/==([^=]+)==/g, '<mark class="note-highlight">$1</mark>');
      // Bold & Italic
      s = s.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
      s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
      s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      s = s.replace(/_([^_]+)_/g, "<em>$1</em>");
      // Gạch ngang
      s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
      // Đường dẫn an toàn [text](url)
      s = s.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="note-md-link">$1</a>'
      );
      // Checklist
      s = s.replace(/^\[ \]\s+/g, '<input type="checkbox" disabled class="note-todo-checkbox"> ');
      s = s.replace(/^\[x\]\s+/gi, '<input type="checkbox" checked disabled class="note-todo-checkbox"> ');
      return s;
    }

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed) {
        closeLists();
        closeTable();
        closeBlockquote();
        continue;
      }

      if (trimmed.startsWith("@@CODEBLOCK_")) {
        closeLists();
        closeTable();
        closeBlockquote();
        out.push(trimmed);
        continue;
      }

      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        closeLists();
        closeBlockquote();
        inTable = true;
        tableRows.push(trimmed);
        continue;
      } else {
        closeTable();
      }

      if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        closeLists();
        closeBlockquote();
        out.push('<hr class="note-hr">');
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        closeLists();
        closeBlockquote();
        const level = Math.min(6, Math.max(1, headingMatch[1].length));
        out.push(
          "<h" +
            level +
            ' class="note-md-heading">' +
            formatInline(headingMatch[2]) +
            "</h" +
            level +
            ">"
        );
        continue;
      }

      if (trimmed.startsWith(">")) {
        closeLists();
        const bqContent = trimmed.replace(/^>\s?/, "");
        if (!inBlockquote) {
          out.push('<blockquote class="note-md-blockquote">');
          inBlockquote = true;
        }
        out.push("<p>" + formatInline(bqContent) + "</p>");
        continue;
      } else {
        closeBlockquote();
      }

      const ulMatch = trimmed.match(/^[-*•]\s+(.*)$/);
      if (ulMatch) {
        if (inOl) {
          out.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          out.push('<ul class="note-md-list">');
          inUl = true;
        }
        out.push("<li>" + formatInline(ulMatch[1]) + "</li>");
        continue;
      }

      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (olMatch) {
        if (inUl) {
          out.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          out.push('<ol class="note-md-list">');
          inOl = true;
        }
        out.push("<li>" + formatInline(olMatch[2]) + "</li>");
        continue;
      }

      closeLists();
      out.push('<p class="note-md-p">' + formatInline(rawLine) + "</p>");
    }

    closeLists();
    closeTable();
    closeBlockquote();

    let html = out.join("\n");

    // Khôi phục code blocks
    html = html.replace(/@@CODEBLOCK_(\d+)@@/g, (_, idx) => codeBlocks[Number(idx)]);

    // Khôi phục math formulas
    html = html.replace(/@@MATH_(\d+)@@/g, (_, idx) => mathHolders[Number(idx)]);

    return html;
  }

  function triggerMathRender(element) {
    if (typeof renderMathInElement === "function" && element) {
      try {
        renderMathInElement(element, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        });
      } catch (e) {
        console.warn("KaTeX render error in quick note:", e);
      }
    }
  }

  const DEFAULT_NOTES = [
    {
      id: "note-starter-1",
      subject: "general",
      title: "Chiến thuật ôn thi hiệu quả",
      content:
        "1. Học theo **Pomodoro 25p - nghỉ 5p** để giữ tập trung tối đa.\n2. Ưu tiên giải các đề kiểm tra chính thức trước.\n3. Note lại các câu hay sai để xem lại trước giờ vào phòng thi.",
      preview: "",
      previewHtml: "",
      color: "yellow",
      createdAt: Date.now() - 3600000 * 24 * 3,
      updatedAt: Date.now() - 3600000 * 24 * 3,
    },
    {
      id: "note-starter-2",
      subject: "ktvxl",
      title: "Bảng cờ trạng thái 8086 cần nhớ",
      content:
        "• `CF` (Carry): Cờ nhớ phép toán không dấu.\n• `ZF` (Zero): $ZF = 1$ khi kết quả phép tính bằng 0.\n• `SF` (Sign): Cờ dấu (bit dấu cao nhất).\n• `OF` (Overflow): Cờ tràn phép toán có dấu.\n• `IF` (Interrupt): $IF = 1$ cho phép ngắt INTR, $IF = 0$ cấm ngắt.",
      preview: "",
      previewHtml: "",
      color: "blue",
      createdAt: Date.now() - 3600000 * 24 * 2,
      updatedAt: Date.now() - 3600000 * 24 * 2,
    },
    {
      id: "note-starter-3",
      subject: "xstk",
      title: "Công thức Bayes & Xác suất toàn phần",
      content:
        "• **Xác suất toàn phần**: $P(B) = \\sum P(A_i) \\cdot P(B|A_i)$\n• **Công thức Bayes**: $P(A_k|B) = \\frac{P(A_k) \\cdot P(B|A_k)}{P(B)}$\n• **Mẹo Casio**: Gán biến `A`, `B`, `C` vào máy tính để tránh bấm sai dấu ngoặc.",
      preview: "",
      previewHtml: "",
      color: "orange",
      createdAt: Date.now() - 3600000 * 24,
      updatedAt: Date.now() - 3600000 * 24,
    },
    {
      id: "note-starter-4",
      subject: "vldc",
      title: "Giao thoa khe Young (Sóng ánh sáng)",
      content:
        "• **Vị trí vân sáng**: $x = k \\cdot \\frac{\\lambda D}{a}, k \\in \\mathbb{Z}$\n• **Vị trí vân tối**: $x = (k + 0.5) \\cdot \\frac{\\lambda D}{a}$\n• **Khoảng vân**: $i = \\frac{\\lambda D}{a}$\n> Lưu ý đổi đơn vị: $a$ (mm), $D$ (m), $\\lambda$ ($\\mu\\text{m}$), $x$ (mm).",
      preview: "",
      previewHtml: "",
      color: "green",
      createdAt: Date.now() - 3600000 * 12,
      updatedAt: Date.now() - 3600000 * 12,
    },
    {
      id: "note-starter-5",
      subject: "tthcm",
      title: "3 mốc thời gian cốt lõi về Tư tưởng HCM",
      content:
        "• **05/06/1911**: Người ra đi tìm đường cứu nước tại Bến Nhà Rồng.\n• **07/1920**: Đọc Sơ thảo Luận cương Lênin, tìm thấy con đường cứu nước.\n• **03/02/1930**: Thành lập Đảng Cộng sản Việt Nam tại Cửu Long (Hương Cảng).",
      preview: "",
      previewHtml: "",
      color: "pink",
      createdAt: Date.now() - 3600000 * 6,
      updatedAt: Date.now() - 3600000 * 6,
    },
  ];

  // Khởi tạo preview cho starter notes
  DEFAULT_NOTES.forEach((n) => {
    n.preview = renderMarkdown(n.content);
    n.previewHtml = n.preview;
  });

  let notes = [];
  let currentFilter = "all";
  let searchQuery = "";
  let selectedColor = "yellow";
  let editingNoteId = null;
  let createMode = "write"; // 'write' | 'preview'
  const rawViewNoteIds = new Set(); // Ghi chú đang mở chế độ xem thô Markdown

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        notes = [...DEFAULT_NOTES];
        saveNotes(notes);
      } else {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          notes = parsed.map((item) => {
            const preview = item.previewHtml || item.preview || renderMarkdown(item.content);
            return {
              ...item,
              preview: preview,
              previewHtml: preview,
            };
          });
        } else {
          notes = [...DEFAULT_NOTES];
        }
      }
    } catch (_) {
      notes = [...DEFAULT_NOTES];
    }
  }

  function saveNotes(newNotes) {
    notes = newNotes;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.warn("Could not save quick notes to localStorage:", e);
    }
  }

  function formatDate(timestamp) {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    const pad = (n) => String(n).padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${day}/${month} ${hours}:${minutes}`;
  }

  function showToast(message) {
    const existing = document.querySelector(".notes-toast-msg");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "notes-toast-msg";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("visible");
    }, 10);
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 250);
    }, 2000);
  }

  function setCreateMode(mode) {
    createMode = mode;
    const writeBtn = document.getElementById("btn-note-write-tab");
    const previewBtn = document.getElementById("btn-note-preview-tab");
    const contentInput = document.getElementById("quick-note-content-input");
    const previewPane = document.getElementById("quick-note-preview-pane");

    if (!writeBtn || !previewBtn || !contentInput || !previewPane) return;

    if (mode === "preview") {
      writeBtn.classList.remove("active");
      previewBtn.classList.add("active");
      contentInput.style.display = "none";
      previewPane.style.display = "block";

      const content = contentInput.value.trim();
      if (!content) {
        previewPane.innerHTML =
          '<p class="notes-preview-empty"><em>(Chưa có nội dung để xem trước. Nhập ghi chú bằng Markdown để xem trước tại đây)</em></p>';
      } else {
        previewPane.innerHTML = renderMarkdown(content);
        triggerMathRender(previewPane);
      }
    } else {
      previewBtn.classList.remove("active");
      writeBtn.classList.add("active");
      previewPane.style.display = "none";
      contentInput.style.display = "block";
      contentInput.focus();
    }
  }

  function renderNotes() {
    const container = document.getElementById("quick-notes-container");
    const countBadge = document.getElementById("quick-notes-count");
    if (!container) return;

    const query = searchQuery.trim().toLowerCase();
    const filtered = notes.filter((n) => {
      const matchSubject =
        currentFilter === "all" || n.subject === currentFilter;
      const matchQuery =
        !query ||
        (n.title && n.title.toLowerCase().includes(query)) ||
        (n.content && n.content.toLowerCase().includes(query));
      return matchSubject && matchQuery;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ghi chú`;
    }

    const miniCount = document.getElementById("floating-notes-count-mini");
    if (miniCount) {
      miniCount.textContent = notes.length > 0 ? `${notes.length} note` : "Sổ tay";
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="notes-empty-state">
          <div class="empty-icon">📒</div>
          <strong>Chưa có ghi chú nào phù hợp</strong>
          <p>${
            query
              ? 'Không tìm thấy ghi chú khớp với từ khóa "' + escapeHtml(query) + '".'
              : "Hãy tạo ghi chú đầu tiên để lưu lại công thức, mẹo giải hoặc kiến thức quan trọng nhé!"
          }</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    filtered.forEach((note) => {
      const card = document.createElement("div");
      card.className = `quick-note-item note-color-${note.color || "yellow"}`;
      card.dataset.id = note.id;

      if (editingNoteId === note.id) {
        // Edit Mode
        card.innerHTML = `
          <div class="note-edit-box">
            <div class="note-edit-header">
              <span style="font-weight: 800; font-size: 0.8rem;">✏️ Sửa ghi chú (Markdown)</span>
              <select class="neo-select edit-subject-select" style="font-size: 0.8rem; padding: 2px 6px;">
                <option value="general" ${note.subject === "general" ? "selected" : ""}>📌 Ghi chú chung</option>
                <option value="ktvxl" ${note.subject === "ktvxl" ? "selected" : ""}>⚡ Kỹ thuật vi xử lý</option>
                <option value="tthcm" ${note.subject === "tthcm" ? "selected" : ""}>📕 Tư tưởng Hồ Chí Minh</option>
                <option value="vldc" ${note.subject === "vldc" ? "selected" : ""}>⚛️ Vật lý đại cương</option>
                <option value="xstk" ${note.subject === "xstk" ? "selected" : ""}>🎲 Xác suất thống kê</option>
              </select>
            </div>
            <input type="text" class="notes-input edit-title-input" value="${escapeHtml(note.title)}" maxlength="120" placeholder="Tiêu đề...">
            <div class="notes-editor-tabs" role="tablist">
              <button type="button" class="notes-tab-toggle active edit-tab-write">✏️ Soạn thảo</button>
              <button type="button" class="notes-tab-toggle edit-tab-preview">👁️ Xem trước</button>
            </div>
            <textarea class="notes-textarea edit-content-textarea" rows="4" maxlength="2000" placeholder="Nội dung...">${escapeHtml(note.content)}</textarea>
            <div class="notes-preview-pane edit-preview-pane" style="display: none;"></div>
            <div class="note-edit-actions">
              <button type="button" class="neo-btn neo-btn-sm neo-btn-yellow btn-save-edit">💾 Lưu lại</button>
              <button type="button" class="neo-btn neo-btn-sm neo-btn-white btn-cancel-edit">Hủy</button>
            </div>
          </div>
        `;

        const tabWrite = card.querySelector(".edit-tab-write");
        const tabPreview = card.querySelector(".edit-tab-preview");
        const editContent = card.querySelector(".edit-content-textarea");
        const editPreview = card.querySelector(".edit-preview-pane");

        tabWrite.addEventListener("click", () => {
          tabPreview.classList.remove("active");
          tabWrite.classList.add("active");
          editPreview.style.display = "none";
          editContent.style.display = "block";
          editContent.focus();
        });

        tabPreview.addEventListener("click", () => {
          tabWrite.classList.remove("active");
          tabPreview.classList.add("active");
          editContent.style.display = "none";
          editPreview.style.display = "block";
          const val = editContent.value.trim();
          editPreview.innerHTML = val ? renderMarkdown(val) : '<p class="notes-preview-empty"><em>(Chưa có nội dung)</em></p>';
          triggerMathRender(editPreview);
        });

        const btnSave = card.querySelector(".btn-save-edit");
        const btnCancel = card.querySelector(".btn-cancel-edit");

        btnSave.addEventListener("click", () => {
          const newTitle = card.querySelector(".edit-title-input").value.trim();
          const newContent = editContent.value.trim();
          const newSubj = card.querySelector(".edit-subject-select").value;

          if (!newTitle && !newContent) {
            showToast("Vui lòng nhập tiêu đề hoặc nội dung!");
            return;
          }

          const rendered = renderMarkdown(newContent);
          const updated = notes.map((item) => {
            if (item.id === note.id) {
              return {
                ...item,
                title: newTitle || "Ghi chú không tiêu đề",
                content: newContent,
                preview: rendered,
                previewHtml: rendered,
                subject: newSubj,
                updatedAt: Date.now(),
              };
            }
            return item;
          });

          saveNotes(updated);
          editingNoteId = null;
          renderNotes();
          showToast("Đã cập nhật ghi chú thành công!");
        });

        btnCancel.addEventListener("click", () => {
          editingNoteId = null;
          renderNotes();
        });
      } else {
        // Normal View Mode
        const subjText = SUBJECT_MAP[note.subject] || "📌 Chung";
        const dateStr = formatDate(note.updatedAt || note.createdAt);
        const isRaw = rawViewNoteIds.has(note.id);
        const previewContent = note.previewHtml || note.preview || renderMarkdown(note.content);

        card.innerHTML = `
          <div class="note-item-header">
            <div class="note-meta-badges">
              <span class="note-badge-subject note-badge-${note.subject}">${subjText}</span>
              <span class="note-badge-time" title="Thời gian cập nhật">${dateStr}</span>
            </div>
            <div class="note-action-btns">
              <button type="button" class="note-mini-btn btn-copy-note" title="Sao chép nội dung">📋</button>
              <button type="button" class="note-mini-btn btn-toggle-raw ${isRaw ? "active-view" : ""}" title="${isRaw ? "Xem dạng Preview" : "Xem mã nguồn Markdown"}">${isRaw ? "👁️ Đọc" : "MD"}</button>
              <button type="button" class="note-mini-btn btn-edit-note" title="Chỉnh sửa">✏️</button>
              <button type="button" class="note-mini-btn btn-delete-note" title="Xóa ghi chú">🗑️</button>
            </div>
          </div>
          ${note.title ? `<div class="note-item-title">${escapeHtml(note.title)}</div>` : ""}
          <div class="note-item-content">
            ${isRaw ? `<pre class="note-raw-source">${escapeHtml(note.content)}</pre>` : previewContent}
          </div>
        `;

        const btnCopy = card.querySelector(".btn-copy-note");
        const btnToggle = card.querySelector(".btn-toggle-raw");
        const btnEdit = card.querySelector(".btn-edit-note");
        const btnDelete = card.querySelector(".btn-delete-note");

        btnCopy.addEventListener("click", () => {
          const copyText = (note.title ? note.title + "\n\n" : "") + note.content;
          navigator.clipboard.writeText(copyText).then(
            () => showToast("Đã sao chép nội dung ghi chú!"),
            () => showToast("Không thể sao chép tự động")
          );
        });

        btnToggle.addEventListener("click", () => {
          if (rawViewNoteIds.has(note.id)) {
            rawViewNoteIds.delete(note.id);
          } else {
            rawViewNoteIds.add(note.id);
          }
          renderNotes();
        });

        btnEdit.addEventListener("click", () => {
          editingNoteId = note.id;
          renderNotes();
        });

        btnDelete.addEventListener("click", () => {
          if (confirm("Bạn có chắc muốn xóa ghi chú này?")) {
            const remaining = notes.filter((item) => item.id !== note.id);
            saveNotes(remaining);
            renderNotes();
            showToast("Đã xóa ghi chú");
          }
        });

        // Trigger math rendering for KaTeX formulas inside the note
        if (!isRaw) {
          triggerMathRender(card.querySelector(".note-item-content"));
        }
      }

      container.appendChild(card);
    });
  }

  function handleCreateNote() {
    const titleInput = document.getElementById("quick-note-title-input");
    const contentInput = document.getElementById("quick-note-content-input");
    const subjectSelect = document.getElementById("quick-note-subject-select");

    if (!titleInput || !contentInput) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const subject = subjectSelect ? subjectSelect.value : "general";

    if (!title && !content) {
      showToast("Vui lòng nhập tiêu đề hoặc nội dung ghi chú!");
      return;
    }

    const rendered = renderMarkdown(content);
    const newNote = {
      id: "note-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      subject: subject || "general",
      title: title || "Ghi chú không tiêu đề",
      content: content,
      preview: rendered,
      previewHtml: rendered,
      color: selectedColor || "yellow",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    notes.unshift(newNote);
    saveNotes(notes);

    titleInput.value = "";
    contentInput.value = "";
    setCreateMode("write");

    // Nếu bộ lọc hiện tại không khớp môn mới, chuyển sang môn mới
    if (currentFilter !== "all" && currentFilter !== newNote.subject) {
      currentFilter = newNote.subject;
      updateFilterTabs();
    }

    renderNotes();
    showToast("Đã thêm ghi chú mới! 📝");
  }

  function updateFilterTabs() {
    document.querySelectorAll(".notes-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.subject === currentFilter);
    });
  }

  function toggleNotesDrawer(forceOpen) {
    const drawer = document.getElementById("side-notes-drawer");
    if (!drawer) return;

    const shouldOpen =
      typeof forceOpen === "boolean"
        ? forceOpen
        : !drawer.classList.contains("open");

    if (shouldOpen) {
      drawer.classList.add("open");
      const plannerDrawer = document.getElementById("side-planner-drawer");
      if (
        plannerDrawer &&
        plannerDrawer.classList.contains("open") &&
        !document.body.classList.contains("planner-pinned")
      ) {
        plannerDrawer.classList.remove("open");
      }
      const titleInput = document.getElementById("quick-note-title-input");
      if (titleInput) {
        setTimeout(() => titleInput.focus(), 150);
      }
    } else {
      drawer.classList.remove("open");
    }
  }

  function togglePinNotesDrawer() {
    const isPinned = document.body.classList.toggle("notes-pinned");
    localStorage.setItem(PIN_KEY, isPinned ? "true" : "false");
    const pinBtn = document.getElementById("btn-pin-notes-drawer");
    if (pinBtn) {
      pinBtn.innerHTML = isPinned ? "📌 Đã ghim" : "📌 Ghim";
      pinBtn.classList.toggle("neo-btn-yellow", isPinned);
      pinBtn.classList.toggle("neo-btn-white", !isPinned);
    }
    if (isPinned) toggleNotesDrawer(true);
  }

  function initEvents() {
    // 1. Floating trigger button
    const trigger = document.getElementById("btn-floating-notes");
    if (trigger) {
      trigger.addEventListener("click", () => toggleNotesDrawer());
    }

    const pomoTrigger = document.getElementById("btn-floating-planner");
    if (pomoTrigger) {
      pomoTrigger.addEventListener("click", () => {
        const drawer = document.getElementById("side-notes-drawer");
        if (drawer && !document.body.classList.contains("notes-pinned")) {
          drawer.classList.remove("open");
        }
      });
    }

    // 2. Close & Pin buttons
    const closeBtn = document.getElementById("btn-close-notes-drawer");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => toggleNotesDrawer(false));
    }

    const pinBtn = document.getElementById("btn-pin-notes-drawer");
    if (pinBtn) {
      pinBtn.addEventListener("click", togglePinNotesDrawer);
    }

    // 3. Subject filter tabs
    document.querySelectorAll(".notes-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.subject || "all";
        updateFilterTabs();
        if (currentFilter !== "all") {
          const select = document.getElementById("quick-note-subject-select");
          if (select) select.value = currentFilter;
        }
        renderNotes();
      });
    });

    // 4. Color picker in create box
    document.querySelectorAll(".notes-color-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        document
          .querySelectorAll(".notes-color-dot")
          .forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
        selectedColor = dot.dataset.color || "yellow";
      });
    });

    // 5. Editor tab switching (Soạn thảo vs Xem trước)
    const btnWrite = document.getElementById("btn-note-write-tab");
    const btnPreview = document.getElementById("btn-note-preview-tab");
    if (btnWrite) {
      btnWrite.addEventListener("click", () => setCreateMode("write"));
    }
    if (btnPreview) {
      btnPreview.addEventListener("click", () => setCreateMode("preview"));
    }

    // 6. Save note button
    const saveBtn = document.getElementById("btn-save-quick-note");
    if (saveBtn) {
      saveBtn.addEventListener("click", handleCreateNote);
    }

    // Phím tắt Ctrl+Enter hoặc Cmd+Enter để lưu nhanh
    const contentInput = document.getElementById("quick-note-content-input");
    if (contentInput) {
      contentInput.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          handleCreateNote();
        }
      });
    }

    // 7. Search input
    const searchInput = document.getElementById("quick-notes-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderNotes();
      });
    }

    // 8. Click outside to close (if not pinned)
    document.addEventListener("click", (e) => {
      const drawer = document.getElementById("side-notes-drawer");
      const trig = document.getElementById("btn-floating-notes");
      if (!drawer || !drawer.classList.contains("open")) return;
      if (document.body.classList.contains("notes-pinned")) return;

      if (!drawer.contains(e.target) && !trig?.contains(e.target)) {
        drawer.classList.remove("open");
      }
    });

    // 9. Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const drawer = document.getElementById("side-notes-drawer");
        if (
          drawer &&
          drawer.classList.contains("open") &&
          !document.body.classList.contains("notes-pinned")
        ) {
          drawer.classList.remove("open");
        }
      }
    });

    // 10. Sync when active subject changes in main practice app
    document.querySelectorAll(".subject-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const subj = btn.dataset.subject;
        const select = document.getElementById("quick-note-subject-select");
        if (select && subj) {
          select.value = subj;
        }
      });
    });
  }

  function init() {
    loadNotes();
    initEvents();
    renderNotes();

    const pinned = localStorage.getItem(PIN_KEY);
    if (pinned === "true") {
      document.body.classList.add("notes-pinned");
      toggleNotesDrawer(true);
      const pinBtn = document.getElementById("btn-pin-notes-drawer");
      if (pinBtn) {
        pinBtn.innerHTML = "📌 Đã ghim";
        pinBtn.classList.remove("neo-btn-white");
        pinBtn.classList.add("neo-btn-yellow");
      }
    }
  }

  // Export to window for external integration / tests
  window.KMA_QUICK_NOTES = {
    renderMarkdown,
    loadNotes,
    renderNotes,
    toggleNotesDrawer,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
