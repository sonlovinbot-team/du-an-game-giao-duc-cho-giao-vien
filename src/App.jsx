import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Plant,
  SquaresFour,
  BookmarkSimple,
  ChalkboardTeacher,
  BookOpen,
  MagnifyingGlass,
  ArrowRight,
  ArrowLeft,
  Play,
  Plus,
  X,
  Clock,
  Cube,
  Shapes,
  CaretDown,
  Check,
  CheckCircle,
  SpeakerHigh,
  SpeakerSlash,
  ArrowsOut,
  ArrowsIn,
  ArrowCounterClockwise,
  Trash,
  List,
  Sparkle,
  Lightbulb,
  Users,
  NumberSquareFour,
  PuzzlePiece,
  GlobeHemisphereEast,
  Leaf,
  SlidersHorizontal,
  Heart,
  DownloadSimple,
} from "@phosphor-icons/react";
import { games } from "./catalog";
import GameArt from "./GameArt";
import "./art.css";
const Games2D = lazy(() => import("./games/Games2D"));
const Games3D = lazy(() => import("./games/Games3D"));
const SUBJECTS = [
  ["Tất cả", SquaresFour],
  ["Toán học", NumberSquareFour],
  ["Tiếng Việt", BookOpen],
  ["Khoa học", Leaf],
  ["Văn hoá Việt", GlobeHemisphereEast],
  ["Tư duy", PuzzlePiece],
];
function read(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem("hatmam-" + key));
    if (data == null) return fallback;
    const valid = (id) => games.some((g) => g.id === id);
    if (key === "saved")
      return Array.isArray(data) ? data.filter(valid) : fallback;
    if (key === "recent")
      return Array.isArray(data)
        ? data.filter(
            (r) =>
              r &&
              valid(r.id) &&
              Number.isFinite(r.score) &&
              Number.isFinite(r.total) &&
              !isNaN(Date.parse(r.date)),
          )
        : fallback;
    if (key === "lessons")
      return Array.isArray(data)
        ? data.filter(
            (l) =>
              l &&
              typeof l.title === "string" &&
              Array.isArray(l.games) &&
              l.games.length &&
              l.games.every(valid) &&
              typeof l.note === "string",
          )
        : fallback;
    if (key === "sound") return typeof data === "boolean" ? data : fallback;
    return data;
  } catch {
    return fallback;
  }
}
function useStored(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem("hatmam-" + key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new Event("hatmam-storage-error"));
    }
  }, [key, value]);
  return [value, setValue];
}
const IconButton = ({ children, label, onClick, ...props }) => (
  <button
    className="icon-button"
    aria-label={label}
    title={label}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);
function App() {
  const [page, setPage] = useState("library"),
    [category, setCategory] = useState("Tất cả"),
    [dimension, setDimension] = useState("Tất cả"),
    [query, setQuery] = useState(""),
    [grade, setGrade] = useState("Tất cả"),
    [sort, setSort] = useState("suggested");
  const [saved, setSaved] = useStored("saved", []),
    [recent, setRecent] = useStored("recent", []),
    [lessons, setLessons] = useStored("lessons", []);
  const [selected, setSelected] = useState(null),
    [active, setActive] = useState(null),
    [sound, setSound] = useStored("sound", true),
    [round, setRound] = useState(0),
    [elapsed, setElapsed] = useState(0),
    [result, setResult] = useState(null),
    [full, setFull] = useState(false),
    [mobileNav, setMobileNav] = useState(false),
    [toast, setToast] = useState("");
  const [lessonTitle, setLessonTitle] = useState("Một tiết học thật vui"),
    [lessonGames, setLessonGames] = useState([]),
    [session, setSession] = useState(null);
  const [lessonNote, setLessonNote] = useState(""),
    [lessonMinutes, setLessonMinutes] = useState(20);
  const detail = useRef(null),
    search = useRef(null),
    gameArea = useRef(null),
    lastFocus = useRef(null),
    sidebarRef = useRef(null);
  useEffect(() => {
    function hash() {
      const id = decodeURIComponent(location.hash.replace("#play/", ""));
      if (location.hash.startsWith("#play/")) {
        const g = games.find((x) => x.id === id);
        if (g) {
          setActive(g);
          setResult(null);
          setElapsed(0);
        }
      } else setActive(null);
    }
    hash();
    addEventListener("hashchange", hash);
    return () => removeEventListener("hashchange", hash);
  }, []);
  useEffect(() => {
    if (selected) {
      lastFocus.current = document.activeElement;
      detail.current?.showModal();
    } else {
      detail.current?.close();
      lastFocus.current?.focus();
    }
  }, [selected]);
  useEffect(() => {
    if (!active || result) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [active, result, round]);
  useEffect(() => {
    const listener = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    function key(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        search.current?.focus();
      }
    }
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    function failed() {
      setToast(
        "Trình duyệt không thể lưu dữ liệu. Thay đổi chỉ có hiệu lực trong phiên này.",
      );
    }
    addEventListener("hatmam-storage-error", failed);
    return () => removeEventListener("hatmam-storage-error", failed);
  }, []);
  useEffect(() => {
    if (!mobileNav) return;
    const previous = document.activeElement;
    const el = sidebarRef.current;
    const focusable = () =>
      [...el.querySelectorAll("button,a[href]")].filter((x) => !x.disabled);
    const focusFrame = requestAnimationFrame(() => focusable()[0]?.focus());
    function key(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileNav(false);
      }
      if (e.key === "Tab") {
        const all = focusable(),
          first = all[0],
          last = all.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    el.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(focusFrame);
      el.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [mobileNav]);
  function navigate(to) {
    setPage(to);
    setMobileNav(false);
    setQuery("");
    setCategory("Tất cả");
    setDimension("Tất cả");
    setGrade("Tất cả");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function toggleSaved(id) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function play(g) {
    setSelected(null);
    setActive(g);
    setElapsed(0);
    setResult(null);
    setRound((r) => r + 1);
    location.hash = "play/" + g.id;
    window.scrollTo(0, 0);
  }
  function complete(r) {
    setResult(r);
    setRecent((old) =>
      [
        {
          id: active.id,
          score: r.score,
          total: r.total,
          date: new Date().toISOString(),
        },
        ...old,
      ].slice(0, 30),
    );
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await gameArea.current.requestFullscreen();
    } catch {
      setToast(
        "Trình duyệt chưa hỗ trợ toàn màn hình. Bạn vẫn có thể chơi bình thường.",
      );
    }
  }
  function leave() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setActive(null);
    setSession(null);
    history.replaceState(null, "", location.pathname + location.search);
  }
  function addLesson(id) {
    setLessonGames((ids) => (ids.includes(id) ? ids : [...ids, id]));
    setToast("Đã thêm vào tiết học đang soạn");
  }
  function saveLesson() {
    if (!lessonTitle.trim() || !lessonGames.length) {
      setToast("Nhập tên và chọn ít nhất một trò chơi cho tiết học.");
      return;
    }
    setLessons((l) => [
      {
        id: Date.now(),
        title: lessonTitle.trim(),
        games: lessonGames,
        note: lessonNote,
        minutes: lessonMinutes,
      },
      ...l,
    ]);
    setLessonGames([]);
    setToast("Đã lưu tiết học trên thiết bị này");
  }
  function startLesson(l) {
    setSession({ lesson: l, index: 0 });
    play(games.find((g) => g.id === l.games[0]));
  }
  function nextGame() {
    const i = session.index + 1;
    if (i >= session.lesson.games.length) {
      leave();
      navigate("lessons");
      setToast("Đã hoàn thành hành trình của tiết học!");
      return;
    }
    setSession((s) => ({ ...s, index: i }));
    play(games.find((g) => g.id === session.lesson.games[i]));
  }
  let filtered = games.filter(
    (g) =>
      (page !== "saved" || saved.includes(g.id)) &&
      (category === "Tất cả" || g.category === category) &&
      (dimension === "Tất cả" || g.dimension === dimension) &&
      (!query ||
        `${g.title} ${g.description} ${g.category}`
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/đ/g, "d")
          .includes(
            query
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/đ/g, "d"),
          )) &&
      (grade === "Tất cả" ||
        (Number(grade) >= g.gradeMin && Number(grade) <= g.gradeMax)),
  );
  if (sort === "name")
    filtered = [...filtered].sort((a, b) =>
      a.title.localeCompare(b.title, "vi"),
    );
  if (sort === "quick")
    filtered = [...filtered].sort((a, b) => a.minutes - b.minutes);
  const clearFilters = () => {
    setQuery("");
    setCategory("Tất cả");
    setDimension("Tất cả");
    setGrade("Tất cả");
  };

  if (active)
    return (
      <div className="play-page" ref={gameArea}>
        <header className="play-header">
          <button className="text-button" onClick={leave}>
            <ArrowLeft size={20} /> <span>Thư viện</span>
          </button>
          <div className="play-title">
            <span className="dimension-label">{active.dimension}</span>
            <h1>{active.title}</h1>
          </div>
          <div className="play-actions">
            <span className="elapsed">
              <Clock size={17} />
              {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
            </span>
            <IconButton
              label={sound ? "Tắt âm thanh" : "Bật âm thanh"}
              onClick={() => setSound(!sound)}
            >
              {sound ? <SpeakerHigh size={21} /> : <SpeakerSlash size={21} />}
            </IconButton>
            <IconButton
              label="Chơi lại"
              onClick={() => {
                setRound((r) => r + 1);
                setResult(null);
                setElapsed(0);
              }}
            >
              <ArrowCounterClockwise size={21} />
            </IconButton>
            <IconButton
              label={full ? "Thoát toàn màn hình" : "Toàn màn hình"}
              onClick={fullscreen}
            >
              {full ? <ArrowsIn size={21} /> : <ArrowsOut size={21} />}
            </IconButton>
          </div>
        </header>
        {session && (
          <div className="lesson-session">
            <ChalkboardTeacher size={20} />
            <span>
              {session.lesson.title} · Trò {session.index + 1}/
              {session.lesson.games.length}
            </span>
            <button onClick={nextGame}>
              {session.index + 1 < session.lesson.games.length
                ? "Trò tiếp theo"
                : "Kết thúc tiết học"}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
        <main className="play-main">
          <Suspense
            fallback={
              <div className="game-loading">
                <Plant size={42} />
                <h2>Đang mở thế giới nhỏ…</h2>
                <p>Chuẩn bị một chút để bắt đầu khám phá.</p>
              </div>
            }
          >
            {active.dimension === "3D" ? (
              <Games3D
                key={active.id + round}
                game={active}
                onComplete={complete}
                onRestart={() => {
                  setResult(null);
                  setElapsed(0);
                }}
                settings={{ sound, difficulty: "normal" }}
              />
            ) : (
              <Games2D
                key={active.id + round}
                game={active}
                onComplete={complete}
                onRestart={() => {
                  setResult(null);
                  setElapsed(0);
                }}
                settings={{ sound, difficulty: "normal" }}
              />
            )}
          </Suspense>
        </main>
        <footer className="play-footer">
          <Plant size={18} />
          <span>Hạt Mầm · Cùng chơi, cùng khám phá</span>
          <button onClick={() => setSelected(active)}>
            <BookOpen size={17} />
            Mục tiêu bài học
          </button>
          {result && (
            <span className="result-badge">
              <CheckCircle size={18} />
              Đã lưu kết quả trên thiết bị
            </span>
          )}
        </footer>
        <dialog
          ref={detail}
          className="detail-dialog"
          aria-label={selected ? selected.title : "Chi tiết trò chơi"}
          onCancel={() => setSelected(null)}
        >
          {selected && (
            <>
              <button
                className="dialog-close icon-button"
                aria-label="Đóng"
                onClick={() => setSelected(null)}
              >
                <X size={22} />
              </button>
              <div className="detail-content">
                <span className="eyebrow">GÓC GIÁO VIÊN</span>
                <h2>{selected.title}</h2>
                <p>{selected.objective || selected.description}</p>
                <div className="instruction-box">
                  <Lightbulb size={22} />
                  <div>
                    <strong>Cách chơi</strong>
                    <p>
                      {Array.isArray(selected.instructions)
                        ? selected.instructions.join(" ")
                        : selected.instructions}
                    </p>
                  </div>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setSelected(null)}
                >
                  Tiếp tục chơi
                  <ArrowRight size={19} />
                </button>
              </div>
            </>
          )}
        </dialog>
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </div>
    );
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Đến nội dung chính
      </a>
      {mobileNav && (
        <div className="sidebar-scrim" onClick={() => setMobileNav(false)} />
      )}
      <aside
        ref={sidebarRef}
        className={"sidebar " + (mobileNav ? "open" : "")}
        role={mobileNav ? "dialog" : undefined}
        aria-modal={mobileNav ? true : undefined}
        aria-label="Menu chính"
      >
        <button
          className="mobile-sidebar-close icon-button"
          aria-label="Đóng menu"
          onClick={() => setMobileNav(false)}
        >
          <X size={22} />
        </button>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("library");
          }}
        >
          <span className="brand-symbol">
            <Plant size={30} weight="fill" />
          </span>
          <span>
            hạt mầm<span className="brand-caption">GIEO NIỀM VUI HỌC TẬP</span>
          </span>
        </a>
        <div className="side-label">KHÔNG GIAN SÁNG TẠO</div>
        <nav aria-label="Điều hướng chính">
          {[
            ["library", "Khám phá trò chơi", SquaresFour],
            ["lessons", "Tiết học của tôi", ChalkboardTeacher],
            ["saved", "Trò chơi đã lưu", BookmarkSimple],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              className={"nav-link " + (page === id ? "active" : "")}
              aria-current={page === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={21} weight={page === id ? "fill" : "regular"} />
              <span>{label}</span>
              {id === "saved" && saved.length > 0 && (
                <span className="nav-count">{saved.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="side-divider" />
        <div className="side-label">CÙNG THẦY CÔ</div>
        <button
          className={"nav-link " + (page === "guide" ? "active" : "")}
          onClick={() => navigate("guide")}
        >
          <BookOpen size={21} />
          <span>Hướng dẫn sử dụng</span>
        </button>
        <div className="side-note">
          <div className="note-drawing">
            <Plant size={49} weight="duotone" />
            <Sparkle size={18} />
          </div>
          <strong>
            Một chút chơi.
            <br />
            Một trời khám phá.
          </strong>
          <p>Biến những điều mới mẻ thành niềm vui mỗi ngày.</p>
          <button
            onClick={() => {
              setSelected(games.find((g) => g.id === "nong-trai"));
            }}
          >
            Thử một trò chơi
            <ArrowRight size={17} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <span className="teacher-icon">
            <ChalkboardTeacher size={23} />
          </span>
          <div>
            Không gian giáo viên<small>Sẵn sàng cho tiết học hay</small>
          </div>
          <span className="online-dot" />
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Mở menu"
              onClick={() => setMobileNav(true)}
            >
              <List size={24} />
            </button>
            <span>Không gian giáo viên</span>
            <span className="crumb-separator">/</span>
            <strong>
              {page === "library"
                ? "Khám phá"
                : page === "saved"
                  ? "Đã lưu"
                  : page === "lessons"
                    ? "Tiết học của tôi"
                    : "Hướng dẫn"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="local-indicator">
              <span />
              Học vui mỗi ngày
            </span>
            <button
              className="top-help"
              onClick={() => navigate("guide")}
              aria-label="Hướng dẫn sử dụng"
            >
              ?
            </button>
          </div>
        </header>
        <main id="main" className="content">
          {(page === "library" || page === "saved") && (
            <>
              {page === "library" && (
                <section className="hero">
                  <div className="hero-copy">
                    <span className="hero-eyebrow">
                      <span className="tiny-sun">
                        <Sparkle size={15} weight="fill" />
                      </span>
                      HỌC BẰNG TRẢI NGHIỆM
                    </span>
                    <h1>
                      Mỗi tiết học,
                      <br />
                      một cuộc <span>phiêu lưu.</span>
                    </h1>
                    <p>
                      Mang cả thế giới vào lớp học với những trò chơi
                      <br className="desktop-break" /> nhỏ. Để học sinh tò mò
                      hơn, hiểu sâu hơn.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() =>
                        document
                          .getElementById("game-library")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Khám phá trò chơi
                      <ArrowRight size={19} />
                    </button>
                    <div className="hero-caption">
                      <span className="hero-caption-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      20 trò chơi <span className="mini-dot" />
                      2D & 3D
                      <span className="mini-dot" />
                      Mở là chơi
                    </div>
                  </div>
                  <div className="hero-art">
                    <GameArt id="hero" />
                    <div className="floating-note">
                      <span>
                        <Cube size={19} weight="duotone" />
                      </span>
                      <div>
                        Kiến thức sống động<small>Chạm, chơi và khám phá</small>
                      </div>
                    </div>
                    <span className="art-caption">
                      Một thế giới nhỏ, ngàn điều hay.
                    </span>
                  </div>
                </section>
              )}
              <section id="game-library" className="library">
                <div className="section-heading">
                  <div className="heading-with-icon">
                    <h2>
                      {page === "saved"
                        ? "Trò chơi đã lưu"
                        : "Hôm nay, mình chơi gì?"}
                    </h2>
                    {page === "library" && (
                      <span className="small-sprout">
                        <Plant size={25} />
                      </span>
                    )}
                    <span className="total-badge">
                      {page === "saved" ? saved.length : games.length} trò chơi
                    </span>
                  </div>
                  <p>
                    {page === "saved"
                      ? "Những ý tưởng yêu thích, sẵn sàng cho tiết học tiếp theo."
                      : "Chọn một trò chơi. Khơi mở một điều mới."}
                  </p>
                </div>
                <div
                  className="subject-tabs"
                  role="group"
                  aria-label="Lọc môn học"
                >
                  {SUBJECTS.map(([s, Icon]) => (
                    <button
                      key={s}
                      className={category === s ? "selected" : ""}
                      aria-pressed={category === s}
                      onClick={() => setCategory(s)}
                    >
                      <Icon
                        size={18}
                        weight={category === s ? "fill" : "regular"}
                      />
                      {s}
                    </button>
                  ))}
                </div>
                <div className="filter-row">
                  <label className="search-field">
                    <MagnifyingGlass size={20} />
                    <input
                      ref={search}
                      aria-label="Tìm trò chơi"
                      placeholder="Tìm trò chơi, chủ đề…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query ? (
                      <button
                        className="clear-search"
                        aria-label="Xoá tìm kiếm"
                        onClick={() => setQuery("")}
                      >
                        <X size={16} />
                      </button>
                    ) : (
                      <kbd>⌘ K</kbd>
                    )}
                  </label>
                  <div className="filter-right">
                    <div
                      className="dimension-switch"
                      aria-label="Loại đồ hoạ"
                      role="group"
                    >
                      {["Tất cả", "2D", "3D"].map((d) => (
                        <button
                          key={d}
                          className={dimension === d ? "selected" : ""}
                          aria-pressed={dimension === d}
                          onClick={() => setDimension(d)}
                        >
                          {d === "3D" && <Cube size={15} />} {d}
                        </button>
                      ))}
                    </div>
                    <label className="select-wrap">
                      <span className="sr-only">Khối lớp</span>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                      >
                        <option value="Tất cả">Mọi khối lớp</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option value={String(n)} key={n}>
                            Lớp {n}
                          </option>
                        ))}
                      </select>
                      <CaretDown size={13} />
                    </label>
                  </div>
                </div>
                <div className="results-bar">
                  <span>
                    {filtered.length} trò chơi dành cho lớp học của bạn
                  </span>
                  <label>
                    Sắp xếp:{" "}
                    <select
                      aria-label="Sắp xếp trò chơi"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="suggested">Gợi ý cho bạn</option>
                      <option value="name">Tên A–Z</option>
                      <option value="quick">Thời gian ngắn nhất</option>
                    </select>
                  </label>
                </div>
                <div className="game-grid">
                  {filtered.map((g, i) => (
                    <article className="game-card" key={g.id}>
                      <div
                        className="card-art"
                        style={{ background: g.color || "#e9efe1" }}
                      >
                        <button
                          className="art-open"
                          aria-label={"Xem trò chơi " + g.title}
                          onClick={() => setSelected(g)}
                        >
                          <GameArt id={g.id} />
                        </button>
                        <span
                          className={
                            "dimension-pill " +
                            (g.dimension === "3D" ? "three" : "")
                          }
                        >
                          {g.dimension === "3D" ? (
                            <Cube size={13} weight="fill" />
                          ) : (
                            <Shapes size={13} weight="fill" />
                          )}
                          {g.dimension}
                        </span>
                        <button
                          className={
                            "save-button " +
                            (saved.includes(g.id) ? "is-saved" : "")
                          }
                          aria-label={
                            (saved.includes(g.id) ? "Bỏ lưu " : "Lưu ") +
                            g.title
                          }
                          aria-pressed={saved.includes(g.id)}
                          onClick={() => toggleSaved(g.id)}
                        >
                          <BookmarkSimple
                            size={18}
                            weight={saved.includes(g.id) ? "fill" : "regular"}
                          />
                        </button>
                        {g.tag && <span className="art-tag">{g.tag}</span>}
                        <button
                          className="quick-play"
                          aria-label={"Chơi ngay " + g.title}
                          onClick={() => play(g)}
                        >
                          <Play size={21} weight="fill" />
                        </button>
                      </div>
                      <div className="card-copy">
                        <div className="card-category">
                          <span
                            style={{ background: categoryColor(g.category) }}
                          />
                          {g.category}
                        </div>
                        <button
                          className="card-title"
                          onClick={() => setSelected(g)}
                        >
                          <h3>{g.title}</h3>
                          <ArrowRight size={18} />
                        </button>
                        <p>{g.description}</p>
                        <div className="card-meta">
                          <span>
                            <Users size={14} />
                            {g.grades}
                          </span>
                          <span>
                            <Clock size={14} />
                            {g.minutes} phút
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {!filtered.length && (
                  <div className="empty-state">
                    <MagnifyingGlass size={42} />
                    <h3>
                      {page === "saved" && !saved.length
                        ? "Giữ lại những trò chơi bạn thích"
                        : "Chưa tìm thấy trò chơi phù hợp"}
                    </h3>
                    <p>
                      {page === "saved" && !saved.length
                        ? "Nhấn biểu tượng lưu trên mỗi trò chơi để tạo bộ sưu tập của bạn."
                        : "Thử một từ khoá khác hoặc bỏ bớt bộ lọc nhé."}
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => {
                        clearFilters();
                        if (page === "saved" && !saved.length)
                          navigate("library");
                      }}
                    >
                      {page === "saved" && !saved.length
                        ? "Khám phá trò chơi"
                        : "Xoá bộ lọc"}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </section>
              {page === "library" && (
                <section className="lesson-banner">
                  <span className="banner-icon">
                    <ChalkboardTeacher size={36} weight="duotone" />
                  </span>
                  <div>
                    <h3>Một tiết học, nhiều niềm vui.</h3>
                    <p>
                      Ghép những trò chơi yêu thích thành hành trình học tập của
                      riêng bạn.
                    </p>
                  </div>
                  <button
                    className="secondary-button"
                    onClick={() => navigate("lessons")}
                  >
                    Soạn tiết học
                    <Plus size={18} />
                  </button>
                </section>
              )}
            </>
          )}
          {page === "lessons" && (
            <section className="lessons-page">
              <div className="section-heading">
                <span className="eyebrow">GÓC SOẠN BÀI</span>
                <h1>Tiết học của tôi</h1>
                <p>Chọn trò chơi, sắp xếp hành trình và cùng lớp bắt đầu.</p>
              </div>
              <div className="lesson-builder">
                <div className="lesson-fields">
                  <label>
                    Tên tiết học
                    <input
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      maxLength={100}
                    />
                  </label>
                  <label>
                    Mục tiêu của tiết học
                    <textarea
                      value={lessonNote}
                      placeholder="Ví dụ: Cùng ôn phép cộng và luyện khả năng hợp tác…"
                      onChange={(e) => setLessonNote(e.target.value)}
                      rows={3}
                    />
                  </label>
                  <label>
                    Thời lượng dự kiến
                    <select
                      value={lessonMinutes}
                      onChange={(e) => setLessonMinutes(Number(e.target.value))}
                    >
                      {[10, 15, 20, 30, 45].map((n) => (
                        <option key={n} value={n}>
                          {n} phút
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="local-note">
                    <CheckCircle size={17} />
                    Tiết học được lưu ngay trên trình duyệt này.
                  </p>
                  <button className="primary-button" onClick={saveLesson}>
                    <Plus size={20} />
                    Lưu tiết học · {lessonGames.length} trò
                  </button>
                </div>
                <div className="lesson-picker">
                  <h3>
                    Hành trình khám phá{" "}
                    <span>{lessonGames.length} đã chọn</span>
                  </h3>
                  {lessonGames.length > 0 && (
                    <ol className="chosen-games">
                      {lessonGames.map((id, i) => {
                        const g = games.find((g) => g.id === id);
                        return (
                          <li key={id}>
                            <span>{i + 1}</span>
                            <strong>{g.title}</strong>
                            <button
                              disabled={i === 0}
                              aria-label={"Đưa " + g.title + " lên trước"}
                              onClick={() =>
                                setLessonGames((ids) => {
                                  const n = [...ids];
                                  [n[i - 1], n[i]] = [n[i], n[i - 1]];
                                  return n;
                                })
                              }
                            >
                              ↑
                            </button>
                            <button
                              aria-label={"Bỏ " + g.title}
                              onClick={() =>
                                setLessonGames((ids) =>
                                  ids.filter((x) => x !== id),
                                )
                              }
                            >
                              <X size={16} />
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                  <div className="picker-grid">
                    {games.map((g) => (
                      <button
                        aria-pressed={lessonGames.includes(g.id)}
                        className={lessonGames.includes(g.id) ? "chosen" : ""}
                        key={g.id}
                        onClick={() =>
                          setLessonGames((ids) =>
                            ids.includes(g.id)
                              ? ids.filter((x) => x !== g.id)
                              : [...ids, g.id],
                          )
                        }
                      >
                        <span className="picker-art">
                          <GameArt id={g.id} />
                        </span>
                        <span>
                          {g.title}
                          <small>
                            {g.dimension} · {g.minutes} phút
                          </small>
                        </span>
                        {lessonGames.includes(g.id) ? (
                          <CheckCircle size={21} weight="fill" />
                        ) : (
                          <Plus size={20} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <h2 className="saved-lessons-title">
                Tiết học đã soạn <span>{lessons.length}</span>
              </h2>
              {!lessons.length ? (
                <p className="muted">
                  Tiết học đầu tiên của bạn sẽ xuất hiện tại đây.
                </p>
              ) : (
                <div className="saved-lessons">
                  {lessons.map((l) => (
                    <article key={l.id}>
                      <div className="lesson-cover">
                        <GameArt id={l.games[0]} />
                      </div>
                      <div>
                        <small>
                          {l.games.length} trò chơi · {l.minutes} phút dự kiến
                        </small>
                        <h3>{l.title}</h3>
                        <p>
                          {l.note ||
                            l.games
                              .map(
                                (id) => games.find((g) => g.id === id)?.title,
                              )
                              .join(" → ")}
                        </p>
                        <div className="lesson-card-actions">
                          <button
                            className="primary-button"
                            onClick={() => startLesson(l)}
                          >
                            <Play size={17} weight="fill" />
                            Bắt đầu tiết học
                          </button>
                          <button
                            className="icon-button"
                            aria-label={"Xoá tiết học " + l.title}
                            onClick={() => {
                              setLessons((ls) =>
                                ls.filter((x) => x.id !== l.id),
                              );
                              setToast("Đã xoá tiết học");
                            }}
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {recent.length > 0 && (
                <div className="recent-results">
                  <h2>Những lượt chơi gần đây</h2>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Trò chơi</th>
                          <th>Kết quả</th>
                          <th>Thời gian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.slice(0, 10).map((r, i) => (
                          <tr key={i}>
                            <td>{games.find((g) => g.id === r.id)?.title}</td>
                            <td>
                              {r.score}/{r.total}
                            </td>
                            <td>{new Date(r.date).toLocaleString("vi-VN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}
          {page === "guide" && (
            <section className="guide-page">
              <span className="eyebrow">CÙNG THẦY CÔ</span>
              <h1>Mở trò chơi. Mở trí tò mò.</h1>
              <p className="guide-lead">
                Hạt Mầm giúp thầy cô đưa hoạt động tương tác vào lớp học chỉ
                trong vài bước.
              </p>
              <div className="guide-steps">
                {[
                  [
                    "01",
                    "Tìm một trò chơi phù hợp",
                    "Lọc theo môn học, khối lớp hoặc đồ hoạ 2D/3D. Nhấn vào trò chơi để xem mục tiêu và cách chơi.",
                    MagnifyingGlass,
                  ],
                  [
                    "02",
                    "Cùng lớp bắt đầu",
                    "Nhấn “Bắt đầu chơi”, mở toàn màn hình khi trình chiếu. Học sinh có thể thao tác bằng chuột, bàn phím hoặc chạm màn hình.",
                    Play,
                  ],
                  [
                    "03",
                    "Ghép thành một tiết học",
                    "Chọn “Thêm vào tiết học”, sắp xếp thứ tự trò chơi rồi lưu lại. Mọi thứ sẵn sàng cho lần dạy tiếp theo.",
                    ChalkboardTeacher,
                  ],
                ].map(([n, t, d, I]) => (
                  <article key={n}>
                    <span>{n}</span>
                    <I size={28} />
                    <h2>{t}</h2>
                    <p>{d}</p>
                  </article>
                ))}
              </div>
              <div className="guide-faq">
                <h2>Một vài điều hữu ích</h2>
                <details open>
                  <summary>Dữ liệu của tôi được lưu ở đâu?</summary>
                  <p>
                    Trò chơi yêu thích, tiết học và kết quả gần đây được lưu
                    trong trình duyệt trên thiết bị này. Chưa có tài khoản hoặc
                    đồng bộ. Khi xoá dữ liệu trình duyệt, các nội dung đã lưu
                    cũng sẽ mất.
                  </p>
                </details>
                <details>
                  <summary>Có thể chơi cả lớp không?</summary>
                  <p>
                    Có. Giáo viên mở trên màn chiếu, mời học sinh lần lượt thao
                    tác hoặc chia nhóm thảo luận rồi trả lời. Ô ăn quan hỗ trợ
                    hai bên luân phiên trên cùng thiết bị. Các trò còn lại chơi
                    trên một màn hình chung.
                  </p>
                </details>
                <details>
                  <summary>Game 3D cần thiết bị như thế nào?</summary>
                  <p>
                    Cần trình duyệt hỗ trợ WebGL. Các trò chơi có nút thao tác
                    tương đương với việc chạm vào mô hình. Nếu thiết bị không
                    hiển thị được 3D, thầy cô vẫn có thể sử dụng các nút hướng
                    dẫn để thực hiện hoạt động.
                  </p>
                </details>
                <details>
                  <summary>Tôi có thể thay câu hỏi của trò chơi không?</summary>
                  <p>
                    Phiên bản này cung cấp bộ nội dung có sẵn. Thầy cô có thể
                    đặt tên, ghi mục tiêu và sắp xếp trò chơi thành tiết học
                    riêng. Biên soạn bộ câu hỏi tuỳ chỉnh chưa có trong phiên
                    bản này.
                  </p>
                </details>
              </div>
              <button
                className="primary-button"
                onClick={() => navigate("library")}
              >
                Khám phá 20 trò chơi
                <ArrowRight size={19} />
              </button>
            </section>
          )}
          <footer className="site-footer">
            <span>
              <Plant size={17} weight="fill" />
              hạt mầm <span className="footer-divider">/</span> Gieo niềm vui,
              nuôi trí tò mò.
            </span>
            <span>
              Được làm cho lớp học Việt <Heart size={14} />
            </span>
          </footer>
        </main>
      </div>
      <dialog
        ref={detail}
        className="detail-dialog"
        aria-label={selected ? selected.title : "Chi tiết trò chơi"}
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === detail.current) setSelected(null);
        }}
      >
        {selected && (
          <>
            <button
              className="dialog-close icon-button"
              aria-label="Đóng chi tiết"
              onClick={() => setSelected(null)}
            >
              <X size={22} />
            </button>
            <div className="detail-art" style={{ background: selected.color }}>
              <GameArt id={selected.id} />
              <span className="dimension-pill">
                {selected.dimension === "3D" ? (
                  <Cube size={15} />
                ) : (
                  <Shapes size={15} />
                )}{" "}
                {selected.dimension}
              </span>
            </div>
            <div className="detail-content">
              <span className="detail-subject">
                {selected.category} · {selected.grades} · {selected.minutes}{" "}
                phút
              </span>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              <div className="instruction-box">
                <Lightbulb size={23} />
                <div>
                  <strong>Học được gì?</strong>
                  <p>{selected.objective || selected.description}</p>
                </div>
              </div>
              <div className="instruction-text">
                <strong>Cách chơi</strong>
                <p>
                  {Array.isArray(selected.instructions)
                    ? selected.instructions.join(" ")
                    : selected.instructions}
                </p>
              </div>
              <div className="detail-actions">
                <button
                  className="primary-button"
                  onClick={() => play(selected)}
                >
                  <Play size={18} weight="fill" />
                  Bắt đầu chơi
                </button>
                <button
                  className="secondary-button"
                  onClick={() => addLesson(selected.id)}
                >
                  {lessonGames.includes(selected.id) ? (
                    <Check size={18} />
                  ) : (
                    <Plus size={18} />
                  )}{" "}
                  {lessonGames.includes(selected.id)
                    ? "Đã thêm"
                    : "Thêm vào tiết học"}
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle size={20} />
          {toast}
        </div>
      )}
    </div>
  );
}
function categoryColor(s) {
  return (
    {
      "Toán học": "#c59452",
      "Tiếng Việt": "#bd7980",
      "Khoa học": "#588a65",
      "Văn hoá Việt": "#bb7e46",
      "Tư duy": "#8283ab",
    }[s] || "#6b9677"
  );
}
export default App;
