import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./games3d.css";

const COLORS = {
  green: "#35765a",
  mint: "#90b887",
  yellow: "#ebbf63",
  coral: "#e78865",
  blue: "#75acc1",
  cream: "#f7eacf",
  purple: "#a692bc",
};
const CROPS = [
  ["Lúa", "Nhiều nước", COLORS.yellow],
  ["Sen", "Ao nước", "#e5a0b0"],
  ["Cà rốt", "Đất tơi", COLORS.coral],
  ["Xương rồng", "Đất khô", COLORS.green],
];
const PLANETS = [
  ["Thủy", "#b1a69b"],
  ["Kim", "#dbb782"],
  ["Trái Đất", "#73adc4"],
  ["Hỏa", "#d98162"],
  ["Mộc", "#c2a37d"],
  ["Thổ", "#ddc390"],
  ["Thiên Vương", "#94c7cb"],
  ["Hải Vương", "#6b86b8"],
];
const LANDMARKS = [
  ["Vịnh Hạ Long", "Bắc"],
  ["Hoàng thành Huế", "Trung"],
  ["Chợ nổi Cái Răng", "Nam"],
  ["Văn Miếu", "Bắc"],
  ["Phố cổ Hội An", "Trung"],
  ["Bến Nhà Rồng", "Nam"],
];
const LAB = [
  ["Cam", ["Đỏ", "Vàng"], "#ee9a58"],
  ["Lục", ["Vàng", "Lam"], "#8ab27d"],
  ["Tím", ["Đỏ", "Lam"], "#a995c1"],
];
const BUILDS = [
  ["Công viên", 2, 3],
  ["Điện mặt trời", 3, 4],
  ["Thư viện", 2, 2],
  ["Nhà máy than", 2, -3],
];
const INFO = {
  "nong-trai": [
    "Nông trại bốn mùa",
    "Chọn hạt giống, rồi chạm vào luống có điều kiện phù hợp.",
  ],
  "he-mat-troi": [
    "Chuyến đi vũ trụ",
    "Chạm các hành tinh theo thứ tự từ gần đến xa Mặt Trời.",
  ],
  "xay-cau": [
    "Kỹ sư nhí",
    "Ghép các thanh có tổng chiều dài bằng khoảng trống, rồi thử cầu.",
  ],
  "khoi-hinh": [
    "Xưởng hình khối",
    "Quan sát mô hình 3D, đếm đúng loại khối được yêu cầu.",
  ],
  "dua-thuyen": [
    "Đua thuyền trên sông",
    "Chọn làn mang đáp án đúng để chèo thuyền về đích.",
  ],
  "phong-thi-nghiem": [
    "Phòng pha màu",
    "Pha đúng hai màu cơ bản để tạo màu mẫu theo mô hình màu vẽ RYB.",
  ],
  "khung-long": [
    "Nhà khảo cổ nhí",
    "Lật hai ô đất mỗi lượt, ghi nhớ và tìm các cặp hóa thạch giống nhau.",
  ],
  "ban-do-viet": [
    "Hành trình Việt Nam",
    "Đưa từng địa danh vào vùng Bắc, Trung hoặc Nam trên sa bàn tượng trưng.",
  ],
  "thanh-pho-xanh": [
    "Thành phố xanh",
    "Dùng 9 xu để xây đủ 3 loại công trình tốt và đạt ít nhất 10 điểm xanh.",
  ],
  "den-long": [
    "Phố đèn lồng",
    "Đọc quy luật màu và hoàn thành ba chiếc đèn còn thiếu.",
  ],
};
function init(id, difficulty) {
  return {
    id,
    run: Date.now(),
    round: 0,
    score: 0,
    selection: null,
    done: false,
    message: "",
    wrong: 0,
    planted: [],
    order: [],
    pieces: [],
    pigments: [],
    open: [],
    matched: [],
    buildings: [],
    budget: 9,
    green: 0,
    lanterns: [],
    difficulty: difficulty || "normal",
  };
}
function shapeCount(round, type) {
  return [3, 4, 2][(round + type) % 3];
}
function bridgeTarget(round) {
  return [7, 9, 8][round % 3];
}
function boatTask(round) {
  return [
    [8, 5],
    [12, 9],
    [17, 6],
    [24, 8],
    [35, 7],
  ][round % 5];
}
function boatChoices(round) {
  const [a, b] = boatTask(round),
    sum = a + b;
  const choices = [sum - 2, sum, sum + 2];
  const shift = round % 3;
  return choices.slice(shift).concat(choices.slice(0, shift));
}
function targetTotal(id) {
  return (
    {
      "nong-trai": 4,
      "he-mat-troi": 8,
      "xay-cau": 3,
      "khoi-hinh": 3,
      "dua-thuyen": 5,
      "phong-thi-nghiem": 3,
      "khung-long": 4,
      "ban-do-viet": 6,
      "thanh-pho-xanh": 1,
      "den-long": 3,
    }[id] || 3
  );
}
function progress(id, s) {
  if (id === "nong-trai") return s.planted.length;
  if (id === "he-mat-troi") return s.order.length;
  if (id === "khung-long") return s.matched.length / 2;
  if (id === "den-long") return s.lanterns.length;
  return s.round;
}
function update(id, s, action) {
  if (s.done) return s;
  let n = { ...s, message: "" };
  const wrong = (message) => ({ ...s, wrong: s.wrong + 1, message });
  const advance = (message) => {
    n.round = s.round + 1;
    n.score = s.score + 1;
    n.message = message;
    if (n.round >= targetTotal(id)) n.done = true;
    return n;
  };
  if (action.startsWith("select:"))
    return { ...s, selection: action.slice(7), message: "" };
  if (id === "nong-trai" && action.startsWith("plot:")) {
    const plot = +action.slice(5);
    if (s.planted.includes(plot))
      return {
        ...s,
        message: "Luống này đã có cây rồi. Chọn một luống khác nhé.",
      };
    if (s.selection === null)
      return { ...s, message: "Chọn một hạt giống ở bên dưới trước nhé." };
    if (+s.selection !== plot)
      return wrong(
        `${CROPS[+s.selection][0]} cần ${CROPS[+s.selection][1].toLowerCase()}. Thử một luống khác nhé!`,
      );
    n.planted = [...s.planted, plot];
    n.score++;
    n.message = "Cây đã bén rễ! Mỗi loại cây thích một môi trường riêng.";
    n.done = n.planted.length === 4;
    return n;
  }
  if (id === "he-mat-troi" && action.startsWith("planet:")) {
    const p = +action.slice(7);
    if (s.order.includes(p)) return s;
    if (p !== s.order.length)
      return wrong(
        `Chưa đúng. Hành tinh tiếp theo là ${PLANETS[s.order.length][0]}.`,
      );
    n.order = [...s.order, p];
    n.score++;
    n.done = n.order.length === 8;
    n.message = `Đã khám phá ${PLANETS[p][0]}!`;
    return n;
  }
  if (id === "xay-cau") {
    if (action === "clear") return { ...s, pieces: [], message: "" };
    if (action.startsWith("piece:")) {
      const len = +action.slice(6);
      if (s.pieces.reduce((a, b) => a + b, 0) + len > bridgeTarget(s.round))
        return wrong("Thanh này làm cầu dài quá. Thử một thanh ngắn hơn.");
      return { ...s, pieces: [...s.pieces, len] };
    }
    if (action === "test") {
      if (s.pieces.reduce((a, b) => a + b, 0) !== bridgeTarget(s.round))
        return wrong("Cầu chưa chạm bờ bên kia. Hãy ghép thêm thanh.");
      n.pieces = [];
      return advance("Hai bờ đã nối liền. Bạn là kỹ sư rất khéo!");
    }
  }
  if (id === "khoi-hinh" && action.startsWith("answer:")) {
    if (+action.slice(7) !== shapeCount(s.round, s.round % 3))
      return wrong("Chưa đúng. Hãy đếm từng khối cùng loại trong sa bàn.");
    return advance("Đếm chính xác! Cùng khám phá nhóm khối tiếp theo.");
  }
  if (id === "dua-thuyen" && action.startsWith("answer:")) {
    const [a, b] = boatTask(s.round);
    if (+action.slice(7) !== a + b)
      return wrong("Thuyền tạm dừng. Tính lại phép cộng để chọn đúng làn nhé!");
    return advance("Chèo thật đều! Thuyền của bạn đã tiến thêm một chặng.");
  }
  if (id === "phong-thi-nghiem") {
    if (action === "clear") return { ...s, pigments: [], message: "" };
    if (action.startsWith("pigment:")) {
      const c = action.slice(8);
      return {
        ...s,
        pigments: s.pigments.includes(c)
          ? s.pigments.filter((x) => x !== c)
          : [...s.pigments, c],
      };
    }
    if (action === "mix") {
      if (
        s.pigments.length !== 2 ||
        !LAB[s.round % 3][1].every((c) => s.pigments.includes(c))
      )
        return wrong(
          "Hỗn hợp chưa đúng. Chọn lại hai màu cơ bản rồi thử tiếp.",
        );
      n.pigments = [];
      return advance("Bạn đã pha được màu mẫu!");
    }
  }
  if (id === "khung-long" && action.startsWith("tile:")) {
    const i = +action.slice(5);
    if (s.matched.includes(i) || s.open.includes(i)) return s;
    const open = s.open.length === 2 ? [] : s.open;
    n.open = [...open, i];
    if (n.open.length === 2) {
      const a = [0, 2, 1, 3, 2, 0, 3, 1];
      if (a[n.open[0]] === a[i]) {
        n.matched = [...s.matched, ...n.open];
        n.score++;
        n.message = "Hai hóa thạch cùng loài!";
        n.done = n.matched.length === 8;
      } else {
        n.message =
          "Hai hóa thạch khác nhau. Ghi nhớ vị trí rồi chọn ô tiếp theo.";
        n.wrong++;
      }
    }
    return n;
  }
  if (id === "ban-do-viet" && action.startsWith("region:")) {
    if (action.slice(7) !== LANDMARKS[s.round % 6][1])
      return wrong("Chưa đúng vùng rồi. Hãy thử lại để khám phá địa danh nhé.");
    return advance(
      `Đúng rồi! ${LANDMARKS[s.round % 6][0]} thuộc miền ${LANDMARKS[s.round % 6][1]}.`,
    );
  }
  if (id === "thanh-pho-xanh") {
    if (action === "undo") {
      const last = s.buildings.at(-1);
      if (last === undefined) return s;
      return {
        ...s,
        buildings: s.buildings.slice(0, -1),
        budget: s.budget + BUILDS[last][1],
        green: s.green - BUILDS[last][2],
        message: "",
      };
    }
    if (action.startsWith("build:")) {
      const i = +action.slice(6),
        b = BUILDS[i];
      if (s.budget < b[1])
        return wrong(
          "Chưa đủ xu. Tháo công trình cuối để điều chỉnh thành phố.",
        );
      n.buildings = [...s.buildings, i];
      n.budget -= b[1];
      n.green += b[2];
      if (n.green >= 10 && [0, 1, 2].every((i) => n.buildings.includes(i))) {
        n.done = true;
        n.score = 1;
        n.round = 1;
        n.message = "Một thành phố đủ xanh, sạch và có không gian học tập!";
      } else
        n.message =
          b[2] < 0
            ? "Nhà máy than làm giảm điểm xanh. Bạn có thể tháo công trình cuối."
            : "Công trình đã hoàn thành. Tiếp tục cân bằng ngân sách nhé.";
      return n;
    }
  }
  if (id === "den-long" && action.startsWith("color:")) {
    const color = +action.slice(6);
    const expected = [0, 1, 2][s.lanterns.length % 3];
    if (color !== expected)
      return wrong("Quan sát nhóm ba màu đầu tiên: đỏ → vàng → xanh.");
    n.lanterns = [...s.lanterns, color];
    n.score++;
    n.done = n.lanterns.length === 3;
    n.message = "Đúng quy luật! Một chiếc đèn nữa đã sáng.";
    return n;
  }
  return s;
}

function makeLabel(text, color = "#354c40", size = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const c = canvas.getContext("2d");
  c.fillStyle = color;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = "600 45px sans-serif";
  c.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    }),
  );
  sp.scale.set(3.6 * size, 0.9 * size, 1);
  return sp;
}
function Stage({ id, state, onAction }) {
  const mount = useRef(null),
    actionRef = useRef(onAction),
    viewRef = useRef(null),
    resetCameraRef = useRef(null);
  actionRef.current = onAction;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const root = mount.current;
    if (!root) return;
    let renderer,
      frame = 0,
      observer;
    const moving = [];
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      id === "he-mat-troi" ? "#182c36" : "#edf0df",
    );
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(10, 12, 15);
    camera.lookAt(0, 0, 0);
    const targets = [];
    const mat = (color) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
    function mesh(geo, color, x = 0, y = 0, z = 0, action) {
      const m = new THREE.Mesh(geo, mat(color));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      if (action) {
        m.userData.action = action;
        targets.push(m);
      }
      return m;
    }
    const box = (x, y, z, w, h, d, color, action) =>
      mesh(new THREE.BoxGeometry(w, h, d), color, x, y, z, action);
    const ball = (x, y, z, r, color, action) =>
      mesh(new THREE.SphereGeometry(r, 24, 16), color, x, y, z, action);
    const cyl = (x, y, z, r, h, color, action) =>
      mesh(new THREE.CylinderGeometry(r, r, h, 24), color, x, y, z, action);
    function label(t, x, y, z, size = 1, color) {
      const l = makeLabel(t, color, size);
      l.position.set(x, y, z);
      scene.add(l);
    }
    function tree(x, z, scale = 1) {
      cyl(x, 0.55 * scale, z, 0.12 * scale, 1.1 * scale, "#997057");
      ball(x, 1.4 * scale, z, 0.65 * scale, COLORS.green);
      ball(x - 0.24 * scale, 1.2 * scale, z, 0.45 * scale, COLORS.mint);
    }
    function house(x, z, color = COLORS.coral) {
      box(x, 0.55, z, 1.1, 1.1, 1, color);
      const roof = mesh(
        new THREE.ConeGeometry(0.95, 0.65, 4),
        "#765b4d",
        x,
        1.4,
        z,
      );
      roof.rotation.y = Math.PI / 4;
      box(x, 0.5, z + 0.51, 0.24, 0.5, 0.02, "#f8eccc");
    }
    function lantern(x, y, z, color, action) {
      const b = ball(x, y, z, 0.46, color, action);
      b.scale.y = 1.2;
      cyl(x, y + 0.55, z, 0.2, 0.08, "#8b6547");
      cyl(x, y - 0.57, z, 0.08, 0.3, COLORS.yellow);
      box(x, y + 0.9, z, 0.025, 0.7, 0.025, "#867857");
      return b;
    }
    function boat(x, z, color) {
      const hull = box(x, 0.25, z, 0.65, 0.4, 1.7, color);
      hull.rotation.z = 0.05;
      mesh(
        new THREE.ConeGeometry(0.33, 0.55, 3),
        color,
        x,
        0.26,
        z - 0.95,
      ).rotation.x = -Math.PI / 2;
      box(x, 0.8, z, 0.04, 1.2, 0.04, "#7b6951");
      const sail = mesh(
        new THREE.ConeGeometry(0.55, 0.9, 3),
        "#fbefd2",
        x + 0.2,
        1,
        z,
      );
      sail.rotation.y = Math.PI / 2;
    }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute(
      "aria-label",
      "Sa bàn 3D tương tác; các nút bên dưới cung cấp thao tác tương đương.",
    );
    root.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight("#fff7df", "#607354", 2.3));
    const sun = new THREE.DirectionalLight("#fff1d0", 3);
    sun.position.set(-6, 12, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    scene.add(sun);
    if (id !== "he-mat-troi") {
      box(0, -0.5, 0, 11, 0.75, 8, "#c7d3ae");
      box(0, -0.91, 0, 10.6, 0.12, 7.6, "#93aa82");
    }
    if (id === "nong-trai") {
      house(-3, -2);
      tree(3.8, -2.5);
      tree(4.2, 2.4, 0.75);
      for (let k = 0; k < 10; k++) {
        box(-4.9, 0.3, -2.9 + k * 0.62, 0.09, 0.72, 0.09, "#eee4c6");
      }
      box(-4.9, 0.42, 0, 0.08, 0.07, 6, "#eee4c6");
      box(-4.9, 0.12, 0, 0.08, 0.07, 6, "#eee4c6");
      for (let k = 0; k < 7; k++) {
        const x = 2.6 + k * 0.23,
          z = -3;
        ball(x, 0.02, z, 0.15, "#b4b7a0");
      }
      box(-3, 0.4, -1.48, 0.34, 0.4, 0.025, "#765942");
      box(-3.35, 0.75, -1.48, 0.2, 0.2, 0.025, "#faf0d3");
      for (let i = 0; i < 4; i++) {
        const x = (i % 2) * 3.4 - 1.7,
          z = Math.floor(i / 2) * 2.6 - 0.5;
        box(
          x,
          -0.03,
          z,
          2.8,
          0.25,
          2,
          i === 1 ? "#7eafb5" : i === 0 ? "#97aaa0" : "#a68a63",
          `plot:${i}`,
        );
        label(CROPS[i][1], x, 0.35, z + 1, 0.55);
        if (state.planted.includes(i)) {
          for (let k = 0; k < 5; k++) {
            const px = x + ((k % 3) - 0.8) * 0.6,
              pz = z + (Math.floor(k / 3) - 0.4) * 0.65;
            cyl(px, 0.45, pz, 0.035, 0.75, COLORS.green);
            if (i === 2)
              mesh(
                new THREE.ConeGeometry(0.12, 0.48, 10),
                COLORS.coral,
                px,
                0.17,
                pz,
              ).rotation.z = Math.PI;
            else if (i === 3) {
              cyl(px, 0.5, pz, 0.15, 0.8, COLORS.green);
              ball(px, 0.95, pz, 0.16, COLORS.green);
            } else ball(px, 0.8, pz, 0.2, CROPS[i][2]);
          }
        }
      }
    } else if (id === "he-mat-troi") {
      camera.position.set(0, 10, 15);
      camera.lookAt(0, 0, 0);
      ball(-4, 0, 0, 1.0, "#f4bc56");
      label("Mặt Trời", -4, -1.2, 0, 0.7, "#fff1c9");
      const positions = [
        [-0.4, 1.1, -2.5],
        [3.5, 0.2, 1.8],
        [-2, 0, 1.7],
        [1.8, 0.5, -2.1],
        [0.1, 0.2, 2.8],
        [4.1, 0.6, -1.7],
        [-2.3, 0.5, -3.1],
        [2.5, 0.2, 3.7],
      ];
      PLANETS.forEach(([name, col], i) => {
        const [x, y, z] = positions[i];
        const p = ball(
          x,
          y,
          z,
          [0.3, 0.48, 0.5, 0.4, 0.75, 0.66, 0.57, 0.55][i],
          col,
          `planet:${i}`,
        );
        moving.push(p);
        if (i === 5) {
          const ring = mesh(
            new THREE.TorusGeometry(0.95, 0.08, 8, 48),
            "#b2aa8b",
            x,
            y,
            z,
          );
          ring.rotation.x = 1.15;
        }
        label(
          `${state.order.includes(i) ? "✓ " : ""}${name}`,
          x,
          y + 1.1,
          z,
          0.65,
          "#f9edce",
        );
      });
      for (let i = 0; i < 50; i++)
        ball(
          Math.sin(i * 71) * 7,
          Math.cos(i * 7) * 3 - 1,
          Math.cos(i * 39) * 5,
          0.025,
          "#c3d0cd",
        );
    } else if (id === "xay-cau") {
      box(0, -0.04, 0, 6, 0.12, 7, COLORS.blue);
      box(-4, 0.15, 0, 2, 0.6, 7, COLORS.mint);
      box(4, 0.15, 0, 2, 0.6, 7, COLORS.mint);
      tree(-4, -2);
      house(4, -2);
      const target = bridgeTarget(state.round);
      let offset = -3;
      state.pieces.forEach((p, i) => {
        const w = (p / target) * 6;
        box(
          offset + w / 2,
          0.55,
          1,
          w - 0.04,
          0.25,
          1.3,
          [COLORS.yellow, COLORS.coral, COLORS.cream][i % 3],
        );
        offset += w;
      });
      label(`Khoảng trống: ${target} m`, 0, 2, -1, 0.8);
      label(
        `${state.pieces.reduce((a, b) => a + b, 0)} / ${target} m`,
        0,
        0.5,
        3,
        0.7,
      );
    } else if (id === "khoi-hinh") {
      const cols = [COLORS.coral, COLORS.blue, COLORS.yellow];
      let index = 0;
      for (let t = 0; t < 3; t++) {
        for (let i = 0; i < shapeCount(state.round, t); i++) {
          const x = ((index % 4) - 1.5) * 2.1,
            z = (Math.floor(index / 4) - 1) * 2.3;
          box(x, -0.04, z, 1.6, 0.13, 1.7, "#dbe0c8");
          if (t === 0) box(x, 0.65, z, 0.95, 1.2, 0.95, cols[t]);
          if (t === 1) ball(x, 0.7, z, 0.62, cols[t]);
          if (t === 2)
            mesh(new THREE.ConeGeometry(0.67, 1.5, 24), cols[t], x, 0.73, z);
          index++;
        }
      }
    } else if (id === "dua-thuyen") {
      box(0, 0, 0, 8, 0.2, 7, COLORS.blue);
      for (let i = 0; i < 3; i++) {
        box((i - 1) * 2.4, -0.02, 0, 0.025, 0.1, 6.9, "#e2efdb");
        const [a, b] = boatTask(state.round);
        label(`${boatChoices(state.round)[i]}`, (i - 1) * 2.4, 0.4, -3, 0.9);
        box(
          (i - 1) * 2.4,
          0.15,
          -2.7,
          1.8,
          0.1,
          0.8,
          "#adcbc5",
          `answer:${boatChoices(state.round)[i]}`,
        );
      }
      boat(0, 2.7 - state.round * 1.05, COLORS.coral);
      tree(-4.4, -2);
      tree(4.5, 1);
      label("ĐÍCH", 0, 1.5, -3.5, 0.7);
    } else if (id === "phong-thi-nghiem") {
      box(0, 0.5, 0, 8, 0.5, 4, "#ceb695");
      for (let i = 0; i < 3; i++) {
        const x = (i - 1) * 2.5,
          c = ["#d87964", "#e6c15e", "#77a2c5"][i];
        cyl(x, 1.4, 0, 0.5, 1.3, "#dbe5df");
        cyl(x, 1.3, 0, 0.44, 0.9, c, `pigment:${["Đỏ", "Vàng", "Lam"][i]}`);
        cyl(x, 2.2, 0, 0.2, 0.4, "#a5b9ae");
        label(["Đỏ", "Vàng", "Lam"][i], x, 2.8, 0, 0.7);
      }
      cyl(
        0,
        1,
        2,
        0.7,
        0.8,
        state.pigments.length === 2
          ? LAB.find((l) =>
              l[1].every((c) => state.pigments.includes(c)),
            )?.[2] || "#a2a28d"
          : "#d2d8c9",
      );
      ball(3.5, 1.3, -1.2, 0.7, LAB[state.round % 3][2]);
      label("Màu mẫu", 3.5, 2.5, -1.2, 0.6);
    } else if (id === "khung-long") {
      tree(-4.5, -2, 0.8);
      tree(4.6, 2, 0.9);
      const fossil = [0, 2, 1, 3, 2, 0, 3, 1];
      for (let i = 0; i < 8; i++) {
        const x = ((i % 4) - 1.5) * 2.15,
          z = (Math.floor(i / 4) - 0.5) * 2.9,
          up = state.open.includes(i) || state.matched.includes(i);
        box(x, 0.13, z, 1.8, 0.4, 2.3, up ? "#efddaf" : "#bda379", `tile:${i}`);
        if (up) {
          label(["🦴", "🐚", "🌿", "🥚"][fossil[i]], x, 0.85, z, 0.9);
          label(
            ["Xương", "Vỏ ốc", "Lá", "Trứng"][fossil[i]],
            x,
            0.35,
            z + 0.8,
            0.45,
          );
        } else {
          label(`${i + 1}`, x, 0.45, z, 0.7);
          box(x, 0.36, z, 0.8, 0.025, 0.025, "#94784f");
        }
      }
    } else if (id === "ban-do-viet") {
      box(0, -0.06, 0, 10, 0.12, 7, COLORS.blue);
      const regions = [
        ["Bắc", -2.5, -1.8],
        ["Trung", 0, 0],
        ["Nam", 2.4, 1.8],
      ];
      regions.forEach(([name, x, z], i) => {
        const land = cyl(
          x,
          0.12,
          z,
          1.8,
          0.4,
          [COLORS.mint, COLORS.yellow, COLORS.coral][i],
          `region:${name}`,
        );
        land.scale.z = 0.72;
        house(x - 0.3, z - 0.2, ["#9fba8a", "#dab779", "#d6997d"][i]);
        label(`Miền ${name}`, x, 2.1, z, 0.7);
      });
      label("Sa bàn vùng miền • không phải bản đồ địa lý", 0, 0.05, 3.3, 0.6);
    } else if (id === "thanh-pho-xanh") {
      box(0, -0.01, 0, 10, 0.08, 0.6, "#b4b8a5");
      box(0, -0.01, 0, 0.6, 0.08, 7, "#b4b8a5");
      for (let i = 0; i < 6; i++) {
        const x = ((i % 3) - 1) * 3,
          z = (Math.floor(i / 3) - 0.5) * 3.5;
        box(x, 0.05, z, 2.4, 0.15, 2.4, "#dae0c1");
        const b = state.buildings[i];
        if (b === 0) {
          tree(x - 0.4, z);
          tree(x + 0.45, z + 0.2, 0.7);
        }
        if (b === 1) {
          box(x, 0.6, z, 1.6, 0.12, 1.2, "#5c899b");
          box(x, 0.25, z, 0.12, 0.6, 0.12, "#b2a58e");
          for (let k = 0; k < 3; k++)
            box(x + (k - 1) * 0.5, 0.68, z, 0.025, 0.025, 1.2, "#d3e0d0");
        }
        if (b === 2) {
          house(x, z, COLORS.coral);
          label("Thư viện", x, 1.9, z, 0.5);
        }
        if (b === 3) {
          box(x, 0.65, z, 1.3, 1.2, 1.1, "#aaa18f");
          cyl(x + 0.4, 1.5, z, 0.16, 1.7, "#777e73");
          ball(x + 0.4, 2.5, z, 0.35, "#bac0b3");
        }
      }
    } else if (id === "den-long") {
      house(-4, -1, "#dec38e");
      house(4, -1, "#deb17f");
      box(0, 3, -1, 8, 0.04, 0.04, "#8b7960");
      for (let i = 0; i < 6; i++) {
        const color = i < 3 ? i : state.lanterns[i - 3];
        lantern(
          (i - 2.5) * 1.35,
          2,
          -1,
          color === undefined
            ? "#d6d6bd"
            : [COLORS.coral, COLORS.yellow, COLORS.green][color],
        );
        if (color === undefined) label("?", (i - 2.5) * 1.35, 2.15, -0.5, 0.6);
      }
      for (let i = 0; i < 3; i++) {
        lantern(
          (i - 1) * 2.4,
          0.9,
          2,
          [COLORS.coral, COLORS.yellow, COLORS.green][i],
          `color:${i}`,
        );
      }
    }
    const controls = new OrbitControls(camera, renderer.domElement);
    const targetY = id === "he-mat-troi" ? 0.4 : id === "nong-trai" ? -1 : -0.3;
    controls.target.set(0, targetY, 0);
    controls.enablePan = false;
    controls.enableDamping = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    controls.dampingFactor = 0.08;
    controls.minDistance = 14;
    controls.maxDistance = 38;
    controls.minPolarAngle = 0.28;
    controls.maxPolarAngle = 1.35;
    let pointerStart = null;
    const pointerDown = (e) => {
      pointerStart = { x: e.clientX, y: e.clientY };
    };
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    const ray = new THREE.Raycaster(),
      pointer = new THREE.Vector2();
    const click = (e) => {
      if (
        !pointerStart ||
        Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) > 6
      )
        return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(targets, false)[0];
      if (hit) actionRef.current(hit.object.userData.action);
    };
    renderer.domElement.addEventListener("pointerup", click);
    let initialResize = true,
      measuredWidth = 0,
      measuredHeight = 0;
    const resize = () => {
      const w = root.clientWidth,
        h = root.clientHeight;
      if (w && h) {
        measuredWidth = w;
        measuredHeight = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.set(
          w / h < 1.1 ? 12 : 10,
          w / h < 1.1 ? 16 : 9,
          w / h < 1.1 ? 21 : 15,
        );
        if (id === "he-mat-troi")
          camera.position.set(0, 10, w / h < 1.1 ? 24 : 17);
        controls.target.set(0, targetY, 0);
        camera.lookAt(0, targetY, 0);
        camera.zoom = id === "he-mat-troi" ? 1 : w / h < 1.1 ? 1.22 : 1.55;
        controls.update();
        controls.saveState();
        const saved = viewRef.current;
        if (
          initialResize &&
          saved?.id === id &&
          saved.run === state.run &&
          saved.width === w &&
          saved.height === h
        ) {
          camera.position.fromArray(saved.position);
          camera.zoom = saved.zoom;
          controls.target.fromArray(saved.target);
          camera.lookAt(controls.target);
          controls.update();
        }
        initialResize = false;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }
    };
    observer = new ResizeObserver(() => {
      if (
        measuredWidth !== root.clientWidth ||
        measuredHeight !== root.clientHeight
      )
        resize();
    });
    observer.observe(root);
    resize();
    resetCameraRef.current = () => {
      controls.reset();
      renderer.render(scene, camera);
    };
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (document.hidden) return;
      controls.update();
      moving.forEach((o, i) => {
        if (!reduced) o.rotation.y += 0.003 * (i + 1);
      });
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      viewRef.current = {
        id,
        run: state.run,
        width: root.clientWidth,
        height: root.clientHeight,
        position: camera.position.toArray(),
        target: controls.target.toArray(),
        zoom: camera.zoom,
      };
      resetCameraRef.current = null;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", click);
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            m.map?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [id, state]);
  return (
    <div className="g3-scene" ref={mount}>
      {failed && (
        <div className="g3-fallback">
          <strong>Chế độ tiết kiệm đồ họa</strong>
          <p>
            Thiết bị chưa hỗ trợ 3D. Bạn vẫn có thể chơi bằng các nút bên dưới.
          </p>
        </div>
      )}
      <span className="g3-scene-tag">SA BÀN TƯƠNG TÁC · 3D</span>
      <button
        type="button"
        className="g3-camera-reset"
        title="Khôi phục góc nhìn"
        aria-label="Khôi phục góc nhìn"
        onClick={() => resetCameraRef.current?.()}
      >
        ↺ Góc nhìn
      </button>
      <span className="g3-orbit-hint">
        Kéo để xoay ·{" "}
        {[
          "nong-trai",
          "he-mat-troi",
          "dua-thuyen",
          "phong-thi-nghiem",
          "khung-long",
          "ban-do-viet",
          "den-long",
        ].includes(id)
          ? "Chạm để chọn"
          : "Cuộn để phóng to"}
      </span>
    </div>
  );
}

export default function Games3D({
  game,
  onComplete,
  onRestart,
  settings = {},
}) {
  const id = typeof game === "string" ? game : game?.id || "nong-trai";
  const [state, setState] = useState(() => init(id, settings.difficulty));
  const notified = useRef(false),
    audioRef = useRef(null);
  useEffect(
    () => () => {
      audioRef.current?.close().catch(() => {});
    },
    [],
  );
  function tone(success) {
    if (settings.sound === false) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      const ctx = audioRef.current || (audioRef.current = new Audio());
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(success ? 640 : 230, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        success ? 880 : 170,
        ctx.currentTime + 0.12,
      );
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.19);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch {
      /* Audio is optional. */
    }
  }
  useEffect(() => {
    setState(init(id, settings.difficulty));
    notified.current = false;
  }, [id, settings.difficulty]);
  useEffect(() => {
    if (state.id === id && state.done && !notified.current) {
      notified.current = true;
      onComplete?.({ score: state.score, total: targetTotal(id) });
    }
  }, [state.done, state.id, id, onComplete, state.score]);
  const act = (action) => {
    const next = update(id, state, action);
    if (next.wrong > state.wrong) tone(false);
    else if (next.score > state.score) tone(true);
    setState(next);
  };
  const restart = () => {
    onRestart?.();
    notified.current = false;
    setState(init(id, settings.difficulty));
  };
  const btn = (label, action, selected = false, disabled = false) => (
    <button
      key={action}
      type="button"
      className={`g3-choice ${selected ? "is-selected" : ""}`}
      onClick={() => act(action)}
      disabled={disabled}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
  let prompt = "",
    controls = null;
  if (id === "nong-trai") {
    prompt = "Mỗi hạt giống có một ngôi nhà thích hợp.";
    controls = (
      <>
        <div className="g3-control-row">
          {CROPS.map((c, i) =>
            btn(
              `${["🌾", "🪷", "🥕", "🌵"][i]} ${c[0]}`,
              `select:${i}`,
              state.selection === String(i),
            ),
          )}
        </div>
        <div className="g3-control-row secondary">
          {CROPS.map((c, i) =>
            btn(
              `${state.planted.includes(i) ? "✓ " : ""}${c[1]}`,
              `plot:${i}`,
              false,
              state.planted.includes(i),
            ),
          )}
        </div>
      </>
    );
  }
  if (id === "he-mat-troi") {
    prompt = `Hành tinh thứ ${Math.min(state.order.length + 1, 8)} từ Mặt Trời là gì?`;
    controls = (
      <div className="g3-control-row">
        {[2, 5, 0, 6, 4, 1, 7, 3].map((i) =>
          btn(
            `${state.order.includes(i) ? "✓ " : ""}${PLANETS[i][0]}`,
            `planet:${i}`,
            false,
            state.order.includes(i),
          ),
        )}
      </div>
    );
  }
  if (id === "xay-cau") {
    prompt = `Nối hai bờ cách nhau ${bridgeTarget(state.round)} m · Đã ghép ${state.pieces.reduce((a, b) => a + b, 0)} m`;
    controls = (
      <div className="g3-control-row">
        {[1, 2, 3, 4].map((n) => btn(`+ Thanh ${n} m`, `piece:${n}`))}
        {btn("↺ Gỡ các thanh", "clear")}
        {btn("Thử cầu →", "test")}
      </div>
    );
  }
  if (id === "khoi-hinh") {
    prompt = `Có bao nhiêu ${["khối hộp màu cam", "khối cầu màu xanh", "khối nón màu vàng"][state.round % 3]}?`;
    controls = (
      <>
        <div className="g3-control-row">
          {[1, 2, 3, 4, 5, 6].map((n) => btn(String(n), `answer:${n}`))}
        </div>
        <p className="g3-accessible-scene">
          Mô tả sa bàn:{" "}
          {[0, 1, 2]
            .map((t) =>
              Array.from(
                { length: shapeCount(state.round, t) },
                () => ["hộp", "cầu", "nón"][t],
              ).join(", "),
            )
            .join("; ")}
          .
        </p>
      </>
    );
  }
  if (id === "dua-thuyen") {
    const [a, b] = boatTask(state.round);
    prompt = `${a} + ${b} = ? Chọn làn để tiến lên.`;
    controls = (
      <div className="g3-control-row">
        {boatChoices(state.round).map((n, i) =>
          btn(`Làn ${i + 1}: ${n}`, `answer:${n}`),
        )}
      </div>
    );
  }
  if (id === "phong-thi-nghiem") {
    prompt = `Màu cần pha: ${LAB[state.round % 3][0]} · Đã chọn: ${state.pigments.join(" + ") || "chưa có"}`;
    controls = (
      <div className="g3-control-row">
        {["Đỏ", "Vàng", "Lam"].map((c) =>
          btn(c, `pigment:${c}`, state.pigments.includes(c)),
        )}
        {btn("Pha màu ✦", "mix")}
        {btn("Làm sạch", "clear")}
      </div>
    );
  }
  if (id === "khung-long") {
    prompt = `Đã tìm thấy ${state.matched.length / 2}/4 cặp hóa thạch`;
    controls = (
      <div className="g3-control-row">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
          btn(
            state.open.includes(i) || state.matched.includes(i)
              ? `${i + 1}: ${["Xương", "Lá", "Vỏ ốc", "Trứng", "Lá", "Xương", "Trứng", "Vỏ ốc"][i]}`
              : `Ô đất ${i + 1}`,
            `tile:${i}`,
            state.open.includes(i),
            state.matched.includes(i),
          ),
        )}
      </div>
    );
  }
  if (id === "ban-do-viet") {
    prompt = `${LANDMARKS[state.round % 6][0]} nằm ở miền nào?`;
    controls = (
      <div className="g3-control-row">
        {["Bắc", "Trung", "Nam"].map((r) => btn(`Miền ${r}`, `region:${r}`))}
      </div>
    );
  }
  if (id === "thanh-pho-xanh") {
    prompt = `Ngân sách: ${state.budget} xu · Điểm xanh: ${state.green}/10 · ${new Set(state.buildings.filter((i) => i < 3)).size}/3 loại công trình tốt`;
    controls = (
      <div className="g3-control-row">
        {BUILDS.map(([name, cost, green], i) =>
          btn(
            `${name} · ${cost} xu · ${green > 0 ? "+" : ""}${green} xanh`,
            `build:${i}`,
          ),
        )}
        {btn("Tháo công trình cuối", "undo", false, !state.buildings.length)}
      </div>
    );
  }
  if (id === "den-long") {
    prompt = `Đỏ → Vàng → Xanh → ${state.lanterns.map((i) => ["Đỏ", "Vàng", "Xanh"][i]).join(" → ")}${state.lanterns.length < 3 ? " → ?" : ""}`;
    controls = (
      <div className="g3-control-row">
        {["🔴 Đỏ", "🟡 Vàng", "🟢 Xanh"].map((c, i) => btn(c, `color:${i}`))}
      </div>
    );
  }
  const info = INFO[id] || INFO["nong-trai"];
  return (
    <div className="g3-game">
      <div className="g3-heading">
        <div>
          <span className="g3-eyebrow">KHÁM PHÁ QUA TRẢI NGHIỆM</span>
          <h2>
            {typeof game === "object" && game.title ? game.title : info[0]}
          </h2>
          <p>{info[1]}</p>
        </div>
        <button className="g3-reset" onClick={restart} type="button">
          ↻ Chơi lại
        </button>
      </div>
      <div
        className="g3-progress"
        role="progressbar"
        aria-label="Tiến độ trò chơi"
        aria-valuenow={progress(id, state)}
        aria-valuemin={0}
        aria-valuemax={targetTotal(id)}
      >
        <span
          style={{ width: `${(progress(id, state) / targetTotal(id)) * 100}%` }}
        />
      </div>
      <Stage id={id} state={state} onAction={act} />
      <div className="g3-panel">
        <div className="g3-prompt">
          {state.done ? "Hoàn thành hành trình!" : prompt}
          <span>
            {Math.min(progress(id, state), targetTotal(id))}/{targetTotal(id)}
          </span>
        </div>
        <div className={state.done ? "g3-finished-controls" : ""}>
          {controls}
        </div>
        <p
          className={`g3-feedback ${state.done ? "success" : ""}`}
          role="status"
          aria-live="polite"
        >
          {state.done
            ? `✦ Tuyệt vời! Bạn đã hoàn thành ${targetTotal(id)} thử thách. ${state.wrong ? `Đã học thêm qua ${state.wrong} lần thử lại.` : "Chính xác ngay từ lần đầu!"}`
            : state.message ||
              "Chạm vào sa bàn hoặc sử dụng các nút lựa chọn để chơi."}
        </p>
        {state.done && (
          <button className="g3-again" onClick={restart}>
            Chơi một lần nữa →
          </button>
        )}
      </div>
    </div>
  );
}
