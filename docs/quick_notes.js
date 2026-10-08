/**
 * Sổ tay ghi chú kiến thức nhanh (Quick Knowledge Notes)
 * Cho phép ghi chú theo môn học hoặc ghi chú chung, tự động lưu trữ, tìm kiếm, chỉnh sửa.
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

  const DEFAULT_NOTES = [
    {
      id: "note-starter-1",
      subject: "general",
      title: "Chiến thuật ôn thi hiệu quả",
      content:
        "1. Học theo Pomodoro 25p - nghỉ 5p để giữ tập trung tối đa.\n2. Ưu tiên giải các đề kiểm tra chính thức trước.\n3. Note lại các câu hay sai để xem lại trước giờ vào phòng thi.",
      color: "yellow",
      createdAt: Date.now() - 3600000 * 24 * 3,
      updatedAt: Date.now() - 3600000 * 24 * 3,
    },
    {
      id: "note-starter-2",
      subject: "ktvxl",
      title: "Bảng cờ trạng thái 8086 cần nhớ",
      content:
        "• CF (Carry): Cờ nhớ phép toán không dấu.\n• ZF (Zero): ZF = 1 khi kết quả phép tính bằng 0.\n• SF (Sign): Cờ dấu (SF = bit dấu cao nhất).\n• OF (Overflow): Cờ tràn phép toán có dấu.\n• IF (Interrupt): IF = 1 cho phép ngắt INTR, IF = 0 cấm ngắt.",
      color: "blue",
      createdAt: Date.now() - 3600000 * 24 * 2,
      updatedAt: Date.now() - 3600000 * 24 * 2,
    },
    {
      id: "note-starter-3",
      subject: "xstk",
      title: "Công thức Bayes & Xác suất toàn phần",
      content:
        "• Xác suất toàn phần: P(B) = ∑ P(Ai)·P(B|Ai)\n• Công thức Bayes: P(Ak|B) = [P(Ak)·P(B|Ak)] / P(B)\n• Mẹo Casio: Gán biến A, B, C vào máy tính để tránh bấm sai dấu ngoặc.",
      color: "orange",
      createdAt: Date.now() - 3600000 * 24,
      updatedAt: Date.now() - 3600000 * 24,
    },
    {
      id: "note-starter-4",
      subject: "vldc",
      title: "Giao thoa khe Young (Sóng ánh sáng)",
      content:
        "• Vị trí vân sáng: x = k · (λD / a), k ∈ ℤ\n• Vị trí vân tối: x = (k + 0.5) · (λD / a)\n• Khoảng vân: i = λD / a\n• Lưu ý đổi đơn vị: a (mm), D (m), λ (µm hoặc nm), x (mm).",
      color: "green",
      createdAt: Date.now() - 3600000 * 12,
      updatedAt: Date.now() - 3600000 * 12,
    },
    {
      id: "note-starter-5",
      subject: "tthcm",
      title: "3 mốc thời gian cốt lõi về Tư tưởng HCM",
      content:
        "• 05/06/1911: Người ra đi tìm đường cứu nước tại Bến Nhà Rồng.\n• 07/1920: Đọc Sơ thảo Luận cương Lênin, tìm thấy con đường cứu nước.\n• 03/02/1930: Thành lập Đảng Cộng sản Việt Nam tại Cửu Long (Hương Cảng).",
      color: "pink",
      createdAt: Date.now() - 3600000 * 6,
      updatedAt: Date.now() - 3600000 * 6,
    },
  ];

  let notes = [];
  let currentFilter = "all";
  let searchQuery = "";
  let selectedColor = "yellow";
  let editingNoteId = null;

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        notes = [...DEFAULT_NOTES];
        saveNotes(notes);
      } else {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          notes = parsed;
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

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
              <span style="font-weight: 800; font-size: 0.8rem;">✏️ Sửa ghi chú</span>
              <select class="neo-select edit-subject-select" style="font-size: 0.8rem; padding: 2px 6px;">
                <option value="general" ${note.subject === "general" ? "selected" : ""}>📌 Ghi chú chung</option>
                <option value="ktvxl" ${note.subject === "ktvxl" ? "selected" : ""}>⚡ Kỹ thuật vi xử lý</option>
                <option value="tthcm" ${note.subject === "tthcm" ? "selected" : ""}>📕 Tư tưởng Hồ Chí Minh</option>
                <option value="vldc" ${note.subject === "vldc" ? "selected" : ""}>⚛️ Vật lý đại cương</option>
                <option value="xstk" ${note.subject === "xstk" ? "selected" : ""}>🎲 Xác suất thống kê</option>
              </select>
            </div>
            <input type="text" class="notes-input edit-title-input" value="${escapeHtml(note.title)}" maxlength="120" placeholder="Tiêu đề...">
            <textarea class="notes-textarea edit-content-textarea" rows="4" maxlength="2000" placeholder="Nội dung...">${escapeHtml(note.content)}</textarea>
            <div class="note-edit-actions">
              <button type="button" class="neo-btn neo-btn-sm neo-btn-yellow btn-save-edit">💾 Lưu lại</button>
              <button type="button" class="neo-btn neo-btn-sm neo-btn-white btn-cancel-edit">Hủy</button>
            </div>
          </div>
        `;

        const btnSave = card.querySelector(".btn-save-edit");
        const btnCancel = card.querySelector(".btn-cancel-edit");

        btnSave.addEventListener("click", () => {
          const editTitle = card.querySelector(".edit-title-input").value.trim();
          const editContent = card.querySelector(".edit-content-textarea").value.trim();
          const editSubj = card.querySelector(".edit-subject-select").value;

          if (!editTitle && !editContent) {
            showToast("Vui lòng nhập tiêu đề hoặc nội dung!");
            return;
          }

          const updated = notes.map((item) => {
            if (item.id === note.id) {
              return {
                ...item,
                title: editTitle || "Ghi chú không tiêu đề",
                content: editContent,
                subject: editSubj,
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

        card.innerHTML = `
          <div class="note-item-header">
            <div class="note-meta-badges">
              <span class="note-badge-subject note-badge-${note.subject}">${subjText}</span>
              <span class="note-badge-time" title="Thời gian cập nhật">${dateStr}</span>
            </div>
            <div class="note-action-btns">
              <button type="button" class="note-mini-btn btn-copy-note" title="Sao chép nội dung">📋</button>
              <button type="button" class="note-mini-btn btn-edit-note" title="Chỉnh sửa">✏️</button>
              <button type="button" class="note-mini-btn btn-delete-note" title="Xóa ghi chú">🗑️</button>
            </div>
          </div>
          ${note.title ? `<div class="note-item-title">${escapeHtml(note.title)}</div>` : ""}
          <div class="note-item-content">${escapeHtml(note.content)}</div>
        `;

        const btnCopy = card.querySelector(".btn-copy-note");
        const btnEdit = card.querySelector(".btn-edit-note");
        const btnDelete = card.querySelector(".btn-delete-note");

        btnCopy.addEventListener("click", () => {
          const copyText = (note.title ? note.title + "\n\n" : "") + note.content;
          navigator.clipboard.writeText(copyText).then(
            () => showToast("Đã sao chép nội dung ghi chú!"),
            () => showToast("Không thể sao chép tự động")
          );
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

    const newNote = {
      id: "note-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      subject: subject || "general",
      title: title || "Ghi chú không tiêu đề",
      content: content,
      color: selectedColor || "yellow",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    notes.unshift(newNote);
    saveNotes(notes);

    titleInput.value = "";
    contentInput.value = "";

    // If current filter doesn't match new note's subject, switch to it or 'all'
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
      // If planner drawer is open and not pinned, close it
      const plannerDrawer = document.getElementById("side-planner-drawer");
      if (
        plannerDrawer &&
        plannerDrawer.classList.contains("open") &&
        !document.body.classList.contains("planner-pinned")
      ) {
        plannerDrawer.classList.remove("open");
      }
      // Auto-focus on title or search
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

    // Also close notes drawer when clicking pomodoro trigger if not pinned
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
        // Also sync the create select if clicking a specific subject
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

    // 5. Save note button
    const saveBtn = document.getElementById("btn-save-quick-note");
    if (saveBtn) {
      saveBtn.addEventListener("click", handleCreateNote);
    }

    // Ctrl+Enter or Cmd+Enter to save
    const contentInput = document.getElementById("quick-note-content-input");
    if (contentInput) {
      contentInput.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          handleCreateNote();
        }
      });
    }

    // 6. Search input
    const searchInput = document.getElementById("quick-notes-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderNotes();
      });
    }

    // 7. Click outside to close (if not pinned)
    document.addEventListener("click", (e) => {
      const drawer = document.getElementById("side-notes-drawer");
      const trigger = document.getElementById("btn-floating-notes");
      if (!drawer || !drawer.classList.contains("open")) return;
      if (document.body.classList.contains("notes-pinned")) return;

      if (!drawer.contains(e.target) && !trigger?.contains(e.target)) {
        drawer.classList.remove("open");
      }
    });

    // 8. Escape key to close
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

    // 9. Sync when active subject changes in main practice app
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

    // Check if drawer was previously pinned
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
