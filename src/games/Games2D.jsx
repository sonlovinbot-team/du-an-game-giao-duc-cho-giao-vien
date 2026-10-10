import React, { useState, useEffect, useRef } from "react";
import "./games2d.css";

const mix = (a) => [...a].sort(() => Math.random() - 0.5);
const normal = (s) => s.toLocaleLowerCase("vi").trim().replace(/\s+/g, " ");
function useTone(enabled) {
  const ctx = useRef(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  useEffect(
    () => () => {
      ctx.current?.close().catch(() => {});
    },
    [],
  );
  return (f = 520, d = 0.13) => {
    if (!enabledRef.current) return;
    try {
      ctx.current ||= new (window.AudioContext || window.webkitAudioContext)();
      ctx.current.resume().catch(() => {});
      const o = ctx.current.createOscillator(),
        g = ctx.current.createGain();
      o.connect(g);
      g.connect(ctx.current.destination);
      o.frequency.value = f;
      g.gain.setValueAtTime(0.09, ctx.current.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.current.currentTime + d);
      o.start();
      o.stop(ctx.current.currentTime + d);
      o.onended = () => {
        o.disconnect();
        g.disconnect();
      };
    } catch {}
  };
}
function Notice({ children }) {
  return (
    <div className="g2-notice" role="status" aria-live="polite">
      {children || "Một chút quan sát, một chút tò mò. Mình thử nhé!"}
    </div>
  );
}
function Tag({ children }) {
  return <span className="g2-tag">{children}</span>;
}
function Art({ kind = "tree" }) {
  return (
    <svg className="g2-art" viewBox="0 0 260 170" aria-hidden="true">
      <ellipse cx="130" cy="154" rx="102" ry="10" fill="#d4dfc4" />
      <circle cx="215" cy="30" r="20" fill="#f6ca68" />
      {kind === "tree" ? (
        <>
          <path d="M121 150V72h18v78" fill="#b48760" />
          <path
            d="M80 116c-44-12-21-54 1-54-7-39 47-57 65-28 42-11 57 24 42 46 31 32-16 65-49 39-17 12-37 9-59-3"
            fill="#7ba776"
          />
          <circle cx="98" cy="69" r="8" fill="#eab07b" />
          <circle cx="150" cy="92" r="8" fill="#eab07b" />
        </>
      ) : (
        <>
          <path d="M38 93l70-48 74 48v60H38z" fill="#efbe81" />
          <path
            d="M21 94l87-59 89 59"
            fill="none"
            stroke="#ce7459"
            strokeWidth="16"
            strokeLinejoin="round"
          />
          <path d="M94 153v-42h29v42" fill="#5c8074" />
          <path d="M53 110h24v23H53zM140 110h24v23h-24z" fill="#fff6d8" />
        </>
      )}
    </svg>
  );
}

function Seeds({ n }) {
  return (
    <span className="g2-seeds">
      {Array.from({ length: Math.min(n, 18) }, (_, i) => (
        <i key={i} />
      ))}
      {n > 18 && <small>+{n - 18}</small>}
    </span>
  );
}
function OAnQuan({ finish, tone }) {
  const [board, setBoard] = useState([10, 5, 5, 5, 5, 5, 10, 5, 5, 5, 5, 5]),
    [player, setPlayer] = useState(0),
    [scores, setScores] = useState([0, 0]),
    [turn, setTurn] = useState(0),
    [dir, setDir] = useState(1),
    [msg, setMsg] = useState("Đội Lá chọn một ô dân ở hàng dưới để rải.");
  const own = player === 0 ? [7, 8, 9, 10, 11] : [1, 2, 3, 4, 5];
  function play(index) {
    if (!own.includes(index) || !board[index]) return;
    const b = [...board],
      s = [...scores];
    let at = index,
      count = b[at];
    b[at] = 0;
    let guard = 0;
    const next = (i) => (i + dir + 12) % 12;
    while (guard++ < 150) {
      while (count > 0) {
        at = next(at);
        b[at]++;
        count--;
      }
      let p = next(at);
      if (p === 0 || p === 6) break;
      if (b[p] > 0) {
        count = b[p];
        b[p] = 0;
        at = p;
        continue;
      }
      let eat = next(p);
      while (!b[p] && b[eat] > 0) {
        s[player] += b[eat];
        b[eat] = 0;
        p = next(eat);
        eat = next(p);
      }
      break;
    }
    const other = 1 - player,
      nextOwn = other === 0 ? [7, 8, 9, 10, 11] : [1, 2, 3, 4, 5];
    const ended =
      turn >= 19 ||
      (b[0] === 0 && b[6] === 0) ||
      nextOwn.every((i) => b[i] === 0);
    setBoard(b);
    setScores(s);
    setTurn(turn + 1);
    tone();
    if (ended) {
      const final = s.map(
        (v, p) =>
          v +
          (p === 0 ? [7, 8, 9, 10, 11] : [1, 2, 3, 4, 5]).reduce(
            (a, i) => a + b[i],
            0,
          ),
      );
      setScores(final);
      setMsg(
        `Kết thúc! Đội Lá ${final[0]} hạt · Đội Nắng ${final[1]} hạt. Hai đội cùng xem lại nước đi hay nhất nhé.`,
      );
      finish({ score: Math.max(...final), total: 70 });
    } else {
      setPlayer(other);
      setMsg(
        `${s[player] - scores[player] > 0 ? `Ăn được ${s[player] - scores[player]} hạt! ` : ""}Đến lượt Đội ${other === 0 ? "Lá" : "Nắng"}.`,
      );
    }
  }
  const cell = (i) => (
    <button
      key={i}
      className={`g2-pit ${i === 0 || i === 6 ? "g2-king" : ""} ${own.includes(i) ? "g2-own" : ""}`}
      disabled={!own.includes(i) || !board[i]}
      onClick={() => play(i)}
      aria-label={`Ô ${i}, ${board[i]} hạt`}
    >
      <Seeds n={board[i]} />
      <b>{board[i]}</b>
    </button>
  );
  return (
    <>
      <div className="g2-instructions">
        Hai người cùng chơi. Chọn ô dân của đội mình, rải mỗi ô một hạt. Gặp ô
        dân có hạt thì rải tiếp; gặp một ô trống thì ăn ô có hạt ngay sau. Bản
        lớp học: mỗi hạt tính 1 điểm, tối đa 20 lượt; dừng khi một đội hết ô để
        đi.
      </div>
      <div className="g2-scoreline">
        <Tag>🌿 Đội Lá · {scores[0]}</Tag>
        <span>Lượt {turn}/20</span>
        <Tag>☀️ Đội Nắng · {scores[1]}</Tag>
      </div>
      <div className="g2-oaq">
        <div>{cell(0)}</div>
        <div className="g2-pitrows">
          <div>{[1, 2, 3, 4, 5].map(cell)}</div>
          <div>{[11, 10, 9, 8, 7].map(cell)}</div>
        </div>
        <div>{cell(6)}</div>
      </div>
      <div className="g2-actions">
        <button onClick={() => setDir(-dir)}>
          Chiều rải: {dir === 1 ? "↻ Thuận" : "↺ Ngược"}
        </button>
      </div>
      <Notice>{msg}</Notice>
    </>
  );
}
const WORDS = [
  {
    word: "HOA SEN",
    hint: "Loài hoa hồng dịu, thường nở trên đầm.",
    icon: "🪷",
  },
  {
    word: "TRƯỜNG HỌC",
    hint: "Mỗi ngày em đến đây để gặp thầy cô.",
    icon: "🏫",
  },
  {
    word: "CÂY TRE",
    hint: "Thân có đốt, gắn bó với làng quê Việt Nam.",
    icon: "🎋",
  },
];
function Words({ finish, tone }) {
  const [round, setRound] = useState(0),
    [pick, setPick] = useState([]),
    [msg, setMsg] = useState(""),
    [bank, setBank] = useState(() =>
      mix([...WORDS[0].word.replaceAll(" ", "")]),
    );
  const q = WORDS[round];
  function check() {
    if (pick.map((i) => bank[i]).join("") === q.word.replaceAll(" ", "")) {
      tone(780);
      if (round === 2) finish({ score: 3, total: 3 });
      else {
        setRound(round + 1);
        setBank(mix([...WORDS[round + 1].word.replaceAll(" ", "")]));
        setPick([]);
      }
      setMsg("Chính xác! Em ghép chữ rất khéo.");
    } else {
      tone(220);
      setMsg("Chưa đúng rồi. Chạm chữ ở hàng trên để trả lại nhé.");
    }
  }
  return (
    <>
      <div className="g2-instructions">
        Chạm các chữ cái theo thứ tự để tạo thành từ. Chạm chữ đã chọn để trả
        lại.
      </div>
      <div className="g2-word-illustration">
        {q.icon}
        <Tag>Từ {round + 1}/3</Tag>
      </div>
      <h3 className="g2-question">{q.hint}</h3>
      <div className="g2-letter-answer">
        {bank.map((_, i) => (
          <button
            key={i}
            disabled={pick[i] === undefined}
            onClick={() => setPick(pick.filter((_, n) => n !== i))}
          >
            {pick[i] === undefined ? "" : bank[pick[i]]}
          </button>
        ))}
      </div>
      <div className="g2-letterbank">
        {bank.map((l, i) => (
          <button
            key={i}
            disabled={pick.includes(i)}
            onClick={() => {
              setPick([...pick, i]);
              tone(420 + i * 30);
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="g2-actions">
        <button
          className="g2-primary"
          onClick={check}
          disabled={pick.length !== bank.length}
        >
          Kiểm tra từ
        </button>
        <button onClick={() => setPick([])}>Xếp lại</button>
      </div>
      <Notice>{msg}</Notice>
    </>
  );
}
const MEMORY = [
  ["🪷", "Hoa sen"],
  ["🎋", "Cây tre"],
  ["🍚", "Hạt gạo"],
  ["🏮", "Đèn lồng"],
  ["🪁", "Cánh diều"],
  ["🥁", "Trống hội"],
];
function Memory({ finish, tone, settings }) {
  const pairs = settings.difficulty === "easy" ? 4 : 6;
  const [cards] = useState(() =>
      mix(
        MEMORY.slice(0, pairs).flatMap((x, i) => [
          { p: i, t: x[0] },
          { p: i, t: x[1] },
        ]),
      ),
    ),
    [open, setOpen] = useState([]),
    [found, setFound] = useState([]),
    [moves, setMoves] = useState(0);
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    if (cards[a].p === cards[b].p) {
      const id = setTimeout(() => {
        setFound((f) => [...f, cards[a].p]);
        setOpen([]);
        tone(760);
        if (found.length + 1 === pairs) finish({ score: pairs, total: pairs });
      }, 400);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setOpen([]), 1000);
    return () => clearTimeout(id);
  }, [open]);
  function flip(i) {
    if (open.length === 2 || open.includes(i) || found.includes(cards[i].p))
      return;
    setOpen([...open, i]);
    if (open.length === 1) setMoves(moves + 1);
    tone();
  }
  return (
    <>
      <div className="g2-instructions">
        Tìm cặp hình và tên tương ứng. Ghi nhớ vị trí để mở đúng hai thẻ.
      </div>
      <div className="g2-scoreline">
        <Tag>
          {found.length}/{pairs} cặp
        </Tag>
        <span>{moves} lượt lật</span>
      </div>
      <div className="g2-memory">
        {cards.map((c, i) => (
          <button
            key={i}
            onClick={() => flip(i)}
            className={`${open.includes(i) || found.includes(c.p) ? "g2-flipped" : ""} ${found.includes(c.p) ? "g2-matched" : ""}`}
            aria-label={
              open.includes(i) || found.includes(c.p)
                ? c.t
                : `Thẻ úp số ${i + 1}`
            }
          >
            {open.includes(i) || found.includes(c.p) ? c.t : <span>✳</span>}
          </button>
        ))}
      </div>
      <Notice>
        {open.length === 2
          ? cards[open[0]].p === cards[open[1]].p
            ? "Một cặp thật đẹp!"
            : "Ghi nhớ hai thẻ này, mình thử tiếp nhé."
          : "Hình và tên đang tìm nhau."}
      </Notice>
    </>
  );
}
function Fractions({ finish, tone }) {
  const rounds = [
      [1, 4],
      [3, 8],
      [2, 6],
    ],
    [round, setRound] = useState(0),
    [chosen, setChosen] = useState([]),
    [msg, setMsg] = useState("");
  const [n, d] = rounds[round];
  function check() {
    if (chosen.length === n) {
      tone(780);
      if (round === 2) finish({ score: 3, total: 3 });
      else {
        setRound(round + 1);
        setChosen([]);
      }
      setMsg("Đúng rồi! Phần tô màu là tử số; tổng số miếng là mẫu số.");
    } else
      setMsg(`Em đã chọn ${chosen.length}/${d}. Hãy tô đúng ${n} miếng nhé.`);
  }
  return (
    <>
      <div className="g2-instructions">
        Chạm vào từng miếng bánh để tô màu phân số bên cạnh. Chạm lần nữa để bỏ
        chọn.
      </div>
      <div className="g2-fraction-scene">
        <svg
          viewBox="0 0 240 240"
          role="group"
          aria-label={`Bánh chia ${d} phần bằng nhau`}
        >
          {Array.from({ length: d }, (_, i) => {
            const a = (i * Math.PI * 2) / d - Math.PI / 2,
              b = ((i + 1) * Math.PI * 2) / d - Math.PI / 2;
            return (
              <path
                key={i}
                tabIndex="0"
                role="button"
                aria-label={`Miếng ${i + 1}${chosen.includes(i) ? ", đã chọn" : ""}`}
                aria-pressed={chosen.includes(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setChosen(
                      chosen.includes(i)
                        ? chosen.filter((v) => v !== i)
                        : [...chosen, i],
                    );
                  }
                }}
                onClick={() =>
                  setChosen(
                    chosen.includes(i)
                      ? chosen.filter((v) => v !== i)
                      : [...chosen, i],
                  )
                }
                d={`M120 120 L${120 + 106 * Math.cos(a)} ${120 + 106 * Math.sin(a)} A106 106 0 0 1 ${120 + 106 * Math.cos(b)} ${120 + 106 * Math.sin(b)} Z`}
                fill={chosen.includes(i) ? "#edab58" : "#fff7da"}
                stroke="#ad7b44"
                strokeWidth="3"
              />
            );
          })}
        </svg>
        <div>
          <span className="g2-fraction">
            <b>{n}</b>
            <b>{d}</b>
          </span>
          <p>
            Tô màu {n} trong {d} phần
          </p>
          <Tag>Chiếc bánh {round + 1}/3</Tag>
        </div>
      </div>
      <div className="g2-actions">
        <button className="g2-primary" onClick={check}>
          Xong rồi!
        </button>
      </div>
      <Notice>{msg}</Notice>
    </>
  );
}
const REBUS = [
  {
    a: "☀️",
    b: "🌧️",
    labels: ["Mặt trời", "Mưa"],
    word: "cầu vồng",
    hint: "Sau mưa, bầu trời có một dải bảy sắc màu.",
  },
  {
    a: "🚲",
    b: "🏫",
    labels: ["Xe đạp", "Trường học"],
    word: "đi học",
    hint: "Hoạt động mỗi sáng của em để gặp thầy cô.",
  },
  {
    a: "🌳",
    b: "❤️",
    labels: ["Cây xanh", "Trái tim"],
    word: "yêu thiên nhiên",
    hint: "Tình cảm giúp chúng ta bảo vệ cây cối và động vật.",
  },
];
function Rebus({ finish, tone }) {
  const [round, setRound] = useState(0),
    [value, setValue] = useState(""),
    [hint, setHint] = useState(false),
    [msg, setMsg] = useState("");
  const q = REBUS[round];
  function check(e) {
    e.preventDefault();
    if (normal(value) === q.word) {
      tone(780);
      if (round === 2) finish({ score: 3, total: 3 });
      else {
        setRound(round + 1);
        setValue("");
        setHint(false);
      }
      setMsg("Giải mã chính xác!");
    } else setMsg("Chưa đúng. Hãy thử xem gợi ý và viết đủ dấu tiếng Việt.");
  }
  return (
    <>
      <div className="g2-instructions">
        Kết nối ý nghĩa hai hình để tìm một từ hoặc cụm từ tiếng Việt.
      </div>
      <div className="g2-rebus">
        <span role="img" aria-label={q.labels[0]}>
          {q.a}
        </span>
        <b>+</b>
        <span role="img" aria-label={q.labels[1]}>
          {q.b}
        </span>
        <b>=</b>
        <span>?</span>
      </div>
      <form onSubmit={check} className="g2-form">
        <label htmlFor="g2-rebus-answer">
          Đáp án của em · câu {round + 1}/3
        </label>
        <input
          id="g2-rebus-answer"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập từ có dấu…"
          autoComplete="off"
        />
        <div className="g2-actions">
          <button className="g2-primary" type="submit">
            Giải câu đố
          </button>
          <button type="button" onClick={() => setHint(true)}>
            Gợi ý nhỏ
          </button>
        </div>
      </form>
      {hint && <p className="g2-hint">{q.hint}</p>}
      <Notice>{msg}</Notice>
    </>
  );
}
const MAZE = [
  "111111111",
  "100010001",
  "101010101",
  "101000101",
  "101110101",
  "100000101",
  "111010101",
  "100010001",
  "111111111",
];
function Maze({ finish, tone }) {
  const [pos, setPos] = useState([1, 1]),
    [steps, setSteps] = useState(0),
    [leaves, setLeaves] = useState([]),
    [msg, setMsg] = useState("Ghé lấy cả 3 chiếc lá, rồi tìm về ngôi nhà.");
  const tokens = [
    [3, 1],
    [1, 7],
    [7, 3],
  ];
  function move(dx, dy) {
    const [x, y] = pos,
      nx = x + dx,
      ny = y + dy;
    if (MAZE[ny]?.[nx] !== "0") {
      setMsg("Có hàng rào rồi! Mình tìm một lối khác nhé.");
      return;
    }
    setPos([nx, ny]);
    setSteps(steps + 1);
    const leaf = tokens.findIndex(([a, b]) => a === nx && b === ny),
      collected =
        leaf >= 0 && !leaves.includes(leaf) ? [...leaves, leaf] : leaves;
    setLeaves(collected);
    tone(430);
    if (nx === 7 && ny === 7) {
      if (collected.length === 3) finish({ score: 3, total: 3 });
      else
        setMsg(
          `Còn ${3 - collected.length} chiếc lá trên đường. Em quay lại tìm nhé.`,
        );
    } else
      setMsg(
        leaf >= 0
          ? "Nhặt được một chiếc lá kiến thức!"
          : "Theo đường mòn, tìm lối về nhà.",
      );
  }
  useEffect(() => {
    function key(e) {
      if (
        document.querySelector("dialog[open]") ||
        /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)
      )
        return;
      const m = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };
      if (m[e.key]) {
        e.preventDefault();
        move(...m[e.key]);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [pos, steps, leaves]);
  return (
    <>
      <div className="g2-instructions">
        Dùng phím mũi tên hoặc nút điều hướng. Thu thập 3 chiếc lá rồi về nhà ở
        góc dưới bên phải.
      </div>
      <div className="g2-scoreline">
        <Tag>🌿 {leaves.length}/3 chiếc lá</Tag>
        <span>{steps} bước chân</span>
      </div>
      <div className="g2-maze">
        {MAZE.flatMap((row, y) =>
          [...row].map((v, x) => {
            const i = tokens.findIndex(([a, b]) => a === x && b === y);
            return (
              <div
                key={`${x}-${y}`}
                className={v === "1" ? "g2-wall" : "g2-path"}
              >
                {pos[0] === x && pos[1] === y
                  ? "🧒"
                  : x === 7 && y === 7
                    ? "🏡"
                    : i >= 0 && !leaves.includes(i)
                      ? "🌿"
                      : ""}
              </div>
            );
          }),
        )}
      </div>
      <div className="g2-dpad">
        <button aria-label="Đi lên" onClick={() => move(0, -1)}>
          ↑
        </button>
        <div>
          <button aria-label="Sang trái" onClick={() => move(-1, 0)}>
            ←
          </button>
          <button aria-label="Đi xuống" onClick={() => move(0, 1)}>
            ↓
          </button>
          <button aria-label="Sang phải" onClick={() => move(1, 0)}>
            →
          </button>
        </div>
      </div>
      <Notice>{msg}</Notice>
    </>
  );
}
function Music({ finish, tone, settings }) {
  const notes = ["Đô", "Rê", "Mi", "Sol"],
    freq = [261.6, 293.7, 329.6, 392],
    pattern = [0, 1, 2, 0, 2, 3],
    max = settings.difficulty === "easy" ? 4 : 6;
  const [level, setLevel] = useState(2),
    [entry, setEntry] = useState([]),
    [active, setActive] = useState(-1),
    [playing, setPlaying] = useState(false),
    [ready, setReady] = useState(false),
    [msg, setMsg] = useState(
      "Bấm “Nghe giai điệu” rồi chơi lại bằng các thanh đàn.",
    ),
    timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function demo() {
    timers.current.forEach(clearTimeout);
    setPlaying(true);
    setReady(false);
    setEntry([]);
    pattern.slice(0, level).forEach((n, i) => {
      timers.current.push(
        setTimeout(() => {
          setActive(n);
          tone(freq[n], 0.35);
        }, i * 650),
      );
      timers.current.push(setTimeout(() => setActive(-1), i * 650 + 420));
    });
    timers.current.push(
      setTimeout(() => {
        setPlaying(false);
        setReady(true);
        setMsg("Đến lượt em! Chạm theo đúng thứ tự vừa thấy.");
      }, level * 650),
    );
  }
  function press(n) {
    tone(freq[n], 0.3);
    setActive(n);
    timers.current.push(setTimeout(() => setActive(-1), 250));
    const e = [...entry, n];
    setEntry(e);
    if (n !== pattern[e.length - 1]) {
      setReady(false);
      setMsg("Nốt này chưa khớp. Nghe lại rồi thử nhé.");
      return;
    }
    if (e.length === level) {
      setReady(false);
      if (level === max) finish({ score: max, total: max });
      else {
        setLevel(level + 1);
        setMsg("Đúng nhịp rồi! Giai điệu tiếp theo dài thêm một nốt.");
      }
    }
  }
  return (
    <>
      <div className="g2-instructions">
        Nghe và quan sát các thanh đàn sáng lên. Lặp lại giai điệu theo thứ tự.
        Khi tắt âm thanh, em vẫn có thể chơi bằng màu sáng.
      </div>
      <div className="g2-scoreline">
        <Tag>Giai điệu {level} nốt</Tag>
        <span>
          {entry.length}/{level} nốt đã chơi
        </span>
      </div>
      <div className="g2-xylophone">
        {notes.map((n, i) => (
          <button
            key={n}
            aria-pressed={active === i}
            disabled={playing || !ready}
            onClick={() => press(i)}
            className={active === i ? "g2-note-active" : ""}
            style={{
              "--bar": `${155 - i * 20}px`,
              "--note": ["#e3a071", "#e7bf66", "#9fb782", "#82aba0"][i],
            }}
          >
            <i />
            <b>{n}</b>
            <i />
          </button>
        ))}
      </div>
      <div className="g2-actions">
        <button className="g2-primary" disabled={playing} onClick={demo}>
          {playing ? "Đang phát…" : "▶ Nghe giai điệu"}
        </button>
      </div>
      <Notice>{msg}</Notice>
    </>
  );
}
const TRASH = [
  { icon: "🍌", name: "Vỏ chuối", bin: 0 },
  { icon: "📰", name: "Báo cũ sạch", bin: 1 },
  { icon: "🔋", name: "Pin đã dùng", bin: 2 },
  { icon: "🥬", name: "Lá rau bỏ", bin: 0 },
  { icon: "🥫", name: "Lon sạch", bin: 1 },
  { icon: "💡", name: "Bóng đèn hỏng", bin: 2 },
  { icon: "🍎", name: "Lõi táo", bin: 0 },
  { icon: "📦", name: "Hộp giấy sạch", bin: 1 },
];
function Sort({ finish, tone }) {
  const [items] = useState(() => mix(TRASH)),
    [at, setAt] = useState(0),
    [correct, setCorrect] = useState(0),
    [msg, setMsg] = useState("");
  const [counts, setCounts] = useState([0, 0, 0]);
  function sort(bin) {
    const q = items[at];
    if (bin !== q.bin) {
      setMsg(`${q.name} chưa thuộc nhóm này. Em chọn lại nhé.`);
      tone(180);
      return;
    }
    const c = [...counts];
    c[bin]++;
    setCounts(c);
    setCorrect(correct + 1);
    tone(740);
    setMsg("Đúng thùng rồi! Cảm ơn em đã giữ môi trường xanh.");
    if (at === items.length - 1)
      finish({ score: items.length, total: items.length });
    else setAt(at + 1);
  }
  return (
    <>
      <div className="g2-instructions">
        Chọn nhóm phù hợp cho từng vật. Pin và bóng đèn cần được người lớn mang
        tới điểm thu gom chuyên dụng.
      </div>
      <div className="g2-sort-item">
        <span>{items[at].icon}</span>
        <h3>{items[at].name}</h3>
        <Tag>
          Đã phân loại {correct}/{items.length}
        </Tag>
      </div>
      <div className="g2-bins">
        {["Hữu cơ", "Tái chế", "Thu gom riêng"].map((b, i) => (
          <button
            key={b}
            onClick={() => sort(i)}
            style={{ "--bin": ["#88a77a", "#79a7b6", "#c9a273"][i] }}
          >
            <span className="g2-bin-icon">
              <i />
              {["♧", "♻", "!"][i]}
            </span>
            <b>{b}</b>
            <small>{counts[i]} vật</small>
          </button>
        ))}
      </div>
      <Notice>{msg}</Notice>
    </>
  );
}
const SOLUTION = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];
function Sudoku({ finish, tone, settings }) {
  const clues =
    settings.difficulty === "easy"
      ? [0, 1, 3, 4, 6, 7, 8, 9, 11, 12, 14, 15]
      : [0, 3, 5, 6, 9, 10, 12, 15];
  const [grid, setGrid] = useState(() =>
      SOLUTION.map((n, i) => (clues.includes(i) ? n : 0)),
    ),
    [selected, setSelected] = useState(1),
    [msg, setMsg] = useState("Chọn ô trống rồi chọn số.");
  function put(n) {
    if (clues.includes(selected)) return;
    const g = [...grid];
    g[selected] = n;
    setGrid(g);
    tone();
    setMsg("Mỗi hàng, mỗi cột và mỗi vùng 2 × 2 dùng đủ các số 1–4.");
  }
  function check() {
    if (grid.includes(0)) {
      setMsg("Vẫn còn ô trống. Em điền tiếp nhé.");
      return;
    }
    const valid =
      [...Array(4)].every(
        (_, i) =>
          new Set(grid.slice(i * 4, i * 4 + 4)).size === 4 &&
          new Set([0, 1, 2, 3].map((r) => grid[r * 4 + i])).size === 4,
      ) &&
      [0, 2, 8, 10].every(
        (i) =>
          new Set([grid[i], grid[i + 1], grid[i + 4], grid[i + 5]]).size === 4,
      );
    if (valid) {
      tone(800);
      finish({ score: 16, total: 16 });
    } else setMsg("Có số bị lặp. Kiểm tra từng hàng, cột và vùng 2 × 2 nhé.");
  }
  return (
    <>
      <div className="g2-instructions">
        Điền số 1–4: không trùng trong mỗi hàng, cột và ô lớn 2 × 2. Ô nền xanh
        nhạt là số cho sẵn.
      </div>
      <div className="g2-sudoku">
        {grid.map((n, i) => (
          <button
            key={i}
            aria-label={`Hàng ${Math.floor(i / 4) + 1} cột ${(i % 4) + 1}: ${n || "trống"}`}
            className={`${clues.includes(i) ? "g2-clue" : ""} ${selected === i ? "g2-selected" : ""}`}
            onClick={() => {
              setSelected(i);
              if (clues.includes(i))
                setMsg("Số này được cho sẵn. Em chọn một ô nền trắng nhé.");
            }}
          >
            {n || ""}
          </button>
        ))}
      </div>
      <div className="g2-numberpad">
        {[1, 2, 3, 4].map((n) => (
          <button key={n} onClick={() => put(n)}>
            {n}
          </button>
        ))}
        <button onClick={() => put(0)}>Xóa</button>
      </div>
      <div className="g2-actions">
        <button className="g2-primary" onClick={check}>
          Kiểm tra khu vườn số
        </button>
      </div>
      <Notice>{msg}</Notice>
    </>
  );
}
const CIPHERS = [
  {
    seq: ["🍃", "🌸", "🍃", "🌸", "🍃"],
    choices: ["🌸", "🍃", "☀️"],
    answer: 0,
    why: "Một chiếc lá, một bông hoa — lặp lại xen kẽ.",
  },
  {
    seq: ["2", "4", "6", "8"],
    choices: ["9", "10", "12"],
    answer: 1,
    why: "Mỗi số tăng thêm 2.",
  },
  {
    seq: ["🔺", "🔺", "🔵", "🔺", "🔺"],
    choices: ["🔺", "🟨", "🔵"],
    answer: 2,
    why: "Hai tam giác rồi một hình tròn.",
  },
  {
    seq: ["1", "2", "4", "8"],
    choices: ["10", "12", "16"],
    answer: 2,
    why: "Mỗi số gấp đôi số đứng trước.",
  },
];
function Cipher({ finish, tone }) {
  const [round, setRound] = useState(0),
    [msg, setMsg] = useState(""),
    [solved, setSolved] = useState(false);
  const q = CIPHERS[round];
  function choose(i) {
    if (i === q.answer) {
      tone(780);
      setMsg(`Mở khóa thành công! ${q.why}`);
      setSolved(true);
    } else {
      tone(200);
      setMsg("Hãy nhìn lại quy luật giữa những hình hoặc số liền nhau.");
    }
  }
  function next() {
    if (round === 3) finish({ score: 4, total: 4 });
    else {
      setRound(round + 1);
      setSolved(false);
      setMsg("");
    }
  }
  return (
    <>
      <div className="g2-instructions">
        Quan sát dãy và tìm mảnh tiếp theo để mở từng ổ khóa của chiếc rương tri
        thức.
      </div>
      <div className="g2-chest">
        <span>{solved ? "🔓" : "🔒"}</span>
        <Tag>Ổ khóa {round + 1}/4</Tag>
      </div>
      <div className="g2-sequence">
        {q.seq.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
        <span className="g2-missing">{solved ? q.choices[q.answer] : "?"}</span>
      </div>
      <div className="g2-options">
        {q.choices.map((c, i) => (
          <button disabled={solved} onClick={() => choose(i)} key={i}>
            {c}
          </button>
        ))}
      </div>
      {solved && (
        <div className="g2-actions">
          <button className="g2-primary" onClick={next}>
            {round === 3 ? "Mở rương tri thức" : "Ổ khóa tiếp theo →"}
          </button>
        </div>
      )}
      <Notice>{msg}</Notice>
    </>
  );
}
const COMPONENTS = {
  "o-an-quan": OAnQuan,
  "ghep-chu": Words,
  "lat-the": Memory,
  "phan-so": Fractions,
  "duoi-hinh": Rebus,
  "duong-ve-nha": Maze,
  "nhac-viet": Music,
  "phan-loai": Sort,
  sudoku: Sudoku,
  "mat-ma": Cipher,
};
function Session({ game, onComplete, onRestart, settings }) {
  const [result, setResult] = useState(null),
    [retry, setRetry] = useState(0),
    done = useRef(false);
  const tone = useTone(settings.sound !== false);
  const Component = COMPONENTS[game.id] || Cipher;
  function finish(r) {
    if (done.current) return;
    done.current = true;
    setResult(r);
    onComplete?.(r);
  }
  function restart() {
    onRestart?.();
    done.current = false;
    setResult(null);
    setRetry(retry + 1);
  }
  return (
    <div className="g2-root">
      {!result ? (
        <Component
          key={retry}
          finish={finish}
          tone={tone}
          settings={settings}
        />
      ) : (
        <div className="g2-celebration">
          <Art />
          <span className="g2-tag">THÊM MỘT ĐIỀU HAY</span>
          <h2>Em làm tốt lắm!</h2>
          <p>
            {game.id === "o-an-quan"
              ? `Ván chơi kết thúc. Đội dẫn đầu thu được ${result.score} hạt.`
              : `Hoàn thành ${result.score}/${result.total}. Cùng chia sẻ cách em tìm ra lời giải nhé.`}
          </p>
          <button className="g2-primary" onClick={restart}>
            Chơi thêm một lần ↻
          </button>
        </div>
      )}
      {!result && (
        <button className="g2-restart" onClick={restart}>
          ↻ Chơi lại từ đầu
        </button>
      )}
    </div>
  );
}
export default function Games2D({
  game,
  onComplete,
  onRestart,
  settings = {},
}) {
  return (
    <Session
      key={`${game.id}-${settings.difficulty || "normal"}`}
      game={game}
      settings={settings}
      onComplete={onComplete}
      onRestart={onRestart}
    />
  );
}
