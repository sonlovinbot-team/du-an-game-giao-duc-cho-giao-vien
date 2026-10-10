import React, { useId } from "react";
import "./art.css";

const leaf = "#69a866",
  dark = "#357454";
const Tree = ({ x, y, s = 1, c = leaf }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cy="8" rx="23" ry="8" fill="#476b42" opacity=".12" />
    <path d="M0 4V-46" stroke="#967448" strokeWidth="7" strokeLinecap="round" />
    <path d="M0-24L-14-39M0-32L12-47" stroke="#967448" strokeWidth="4" />
    <ellipse cy="-48" rx="23" ry="30" fill={c} />
    <ellipse cx="-9" cy="-54" rx="12" ry="20" fill="#fff" opacity=".12" />
  </g>
);
const House = ({ x, y, s = 1, roof = "#ca7750" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-45 5L16 36 67 7 5-23Z" fill="#476844" opacity=".12" />
    <path d="M-38-48L13-21V24L-38-3Z" fill="#fff4cb" />
    <path d="M13-21L57-47V-3L13 24Z" fill="#e6d5a5" />
    <path d="M-48-50L-7-85 67-47 23-12Z" fill={roof} />
    <path d="M-48-50L23-12 20-5-48-42Z" fill="#a35138" />
    <path d="M23-12L67-47 66-39 20-5Z" fill="#aa5c3e" />
    {[0, 1, 2, 3, 4, 5].map((n) => (
      <path
        key={n}
        d={`M${-37 + n * 12} ${-51 + n * 6}l33-27`}
        stroke="#f3b786"
        strokeWidth="2"
        opacity=".5"
      />
    ))}
    <path d="M-25-27l13 7v17l-13-7Z" fill="#729b92" />
    <path d="M29-13l14-8V8L29 16Z" fill="#8d7653" />
    <path d="M-19-24v15m-6-11l13 7" stroke="#f8eccb" strokeWidth="2" />
  </g>
);
const Child = ({ x, y, c = "#e79051", s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cy="3" rx="9" ry="4" fill="#325047" opacity=".15" />
    <path
      d="M-3-6v9m7-9v9"
      stroke="#474d53"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path d="M-6-17L-7-6H7L6-17Z" fill={c} />
    <circle cy="-24" r="7" fill="#e8bc91" />
    <path d="M-7-25q1-11 11-5l3 6-4-2-5 1Z" fill="#574431" />
  </g>
);
const Cloud = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity=".75">
    <ellipse rx="32" ry="10" />
    <circle cx="-11" cy="-9" r="13" />
    <circle cx="9" cy="-14" r="17" />
  </g>
);
const Cube = ({
  x,
  y,
  s = 1,
  c = "#a8bf89",
  top = "#d1dfb7",
  side = "#7c9b68",
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0-34L35-16 0 3-35-16Z" fill={top} />
    <path d="M-35-16L0 3V43L-35 23Z" fill={c} />
    <path d="M0 3L35-16V23L0 43Z" fill={side} />
  </g>
);
const Sprout = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 1V-19" stroke="#52884c" strokeWidth="3" />
    <path d="M0-10q-21 1-17-17Q2-25 0-10Z" fill="#82b35f" />
    <path d="M0-14q20 2 19-15Q0-28 0-14Z" fill="#a7c768" />
  </g>
);
const Star = ({ x, y, s = 1, fill = "#ebba59" }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0-13L4-4 14-3 7 4 9 14 0 9-9 14-7 4-14-3-4-4Z"
    fill={fill}
  />
);
function Village() {
  return (
    <g>
      <Cloud x={122} y={68} />
      <Cloud x={458} y={40} s={0.8} />
      <ellipse
        cx="320"
        cy="341"
        rx="229"
        ry="30"
        fill="#6e9b65"
        opacity=".15"
      />
      <path
        d="M81 228Q103 151 267 123Q423 119 523 210L529 281Q452 366 253 346L93 284Z"
        fill="#a5bb7c"
      />
      <path
        d="M81 216Q104 145 267 116Q424 113 523 198L529 259Q452 341 253 324L93 267Z"
        fill="#bdd493"
      />
      <path
        d="M174 140Q202 189 256 201T344 255Q368 296 445 305L411 321Q337 302 318 270T232 224Q169 210 146 159Z"
        fill="#7eb9b5"
      />
      <path
        d="M160 151Q185 202 239 213T327 263Q351 300 424 313"
        fill="none"
        stroke="#abd7c9"
        strokeWidth="4"
      />
      <path
        d="M116 248Q170 231 226 257T308 307M300 170Q362 190 416 159"
        fill="none"
        stroke="#e7dfab"
        strokeWidth="19"
        strokeLinecap="round"
      />
      <g transform="translate(363 232)">
        <path d="M0 0L69-39 125-11 58 30Z" fill="#8fab55" />
        {[0, 1, 2, 3, 4].map((n) => (
          <g key={n}>
            <path
              d={`M${10 + n * 12} ${n * 6}l67-37`}
              stroke="#c9d881"
              strokeWidth="4"
            />
            {[0, 1, 2, 3, 4].map((j) => (
              <Sprout
                key={j}
                x={17 + n * 12 + j * 12}
                y={n * 6 - j * 7}
                s={0.33}
              />
            ))}
          </g>
        ))}
      </g>
      <Tree x={140} y={201} s={1.15} />
      <Tree x={477} y={212} s={1.1} />
      <Tree x={453} y={188} s={0.72} />
      <Tree x={339} y={158} s={0.9} />
      <House x={287} y={182} s={1.1} />
      <House x={385} y={157} s={0.55} roof="#d9995b" />
      <House x={167} y={257} s={0.66} />
      <Tree x={109} y={243} s={0.64} />
      <Tree x={211} y={307} s={0.75} />
      <Tree x={490} y={264} s={0.6} />
      <g transform="translate(279 230) rotate(-26)">
        <path d="M-39 0Q0-26 40 0V14Q0-12-39 14Z" fill="#bc8d59" />
        {[-32, -20, -8, 4, 16, 28].map((n) => (
          <path
            key={n}
            d={`M${n} ${-8 + Math.abs(n) / 5}v13`}
            stroke="#f0c995"
            strokeWidth="2"
          />
        ))}
        <path
          d="M-41-12Q0-41 43-12M-39-12V4M42-12V4"
          fill="none"
          stroke="#8d7650"
          strokeWidth="4"
        />
      </g>
      <Child x={260} y={246} s={0.65} />
      <Child x={306} y={212} c="#83a9c0" s={0.7} />
      <Child x={178} y={282} c="#e9b954" s={0.55} />
      <path d="M324 111V68" stroke="#b08c61" strokeWidth="2" />
      <path d="M324 68l25 7-25 8Z" fill="#db6950" />
      <Star x={333} y={76} s={0.18} fill="#ffe7a6" />
      {[
        [219, 151],
        [385, 292],
        [111, 237],
        [369, 193],
        [471, 258],
      ].map(([x, y], i) => (
        <g key={i} fill="#e6cb6f">
          <circle cx={x} cy={y} r="3" />
          <circle cx={x + 5} cy={y + 4} r="2" />
        </g>
      ))}
      <g fill="#fff" opacity=".6">
        <path
          d="M399 46q9-8 18 0m0 0q9-8 18 0"
          fill="none"
          stroke="#779570"
          strokeWidth="2"
        />
        <path
          d="M100 122q6-5 12 0m0 0q6-5 12 0"
          fill="none"
          stroke="#779570"
          strokeWidth="2"
        />
      </g>
    </g>
  );
}

function Scene({ id }) {
  switch (id) {
    case "o-an-quan":
      return (
        <g transform="rotate(-10 200 140)">
          <ellipse
            cx="206"
            cy="193"
            rx="136"
            ry="29"
            fill="#a1834c"
            opacity=".14"
          />
          <rect x="62" y="89" width="276" height="116" rx="57" fill="#b58d59" />
          <rect x="62" y="80" width="276" height="116" rx="57" fill="#d5b77c" />
          <rect
            x="70"
            y="86"
            width="260"
            height="103"
            rx="49"
            fill="#e8cea0"
            stroke="#b38c58"
            strokeWidth="2"
          />
          <path
            d="M113 89V186M287 89V186M113 137H287"
            stroke="#af8f61"
            strokeWidth="2"
          />
          {[0, 1, 2, 3, 4].map((n) => (
            <g key={n}>
              <path
                d={`M${113 + n * 35} 89V186`}
                stroke="#af8f61"
                strokeWidth="2"
              />
              {[0, 1].map((r) => (
                <g key={r}>
                  {[0, 1, 2, 3, 4].map((j) => (
                    <ellipse
                      key={j}
                      cx={123 + n * 35 + (j % 2) * 12}
                      cy={102 + r * 49 + Math.floor(j / 2) * 10}
                      rx="4.5"
                      ry="3.4"
                      fill={j % 2 ? "#7d8070" : "#f6f0da"}
                      stroke="#b6af92"
                      strokeWidth=".7"
                    />
                  ))}
                </g>
              ))}
            </g>
          ))}
          <ellipse cx="91" cy="138" rx="9" ry="13" fill="#f7f0dd" />
          <ellipse cx="308" cy="138" rx="9" ry="13" fill="#7e8171" />
          <path
            d="M38 84q12-18 29-20M311 55q17 3 27 17"
            fill="none"
            stroke="#ba9a60"
            strokeWidth="2"
            strokeDasharray="4 5"
          />
        </g>
      );
    case "nong-trai":
      return (
        <g>
          <Cloud x={300} y={48} s={0.65} />
          <path d="M54 161L211 86 356 151 196 230Z" fill="#a5c273" />
          <path d="M54 161L196 230V242L54 174Z" fill="#829e5b" />
          <path d="M196 230L356 151V164L196 242Z" fill="#749353" />
          <House x={129} y={131} s={0.6} />
          <Tree x={301} y={147} s={0.85} />
          {[0, 1, 2].map((n) => (
            <g key={n}>
              <path
                d={`M${127 + n * 27} ${161 + n * 14}l85-42 28 12-85 43Z`}
                fill="#a58352"
              />
              {[0, 1, 2, 3].map((j) => (
                <Sprout
                  key={j}
                  x={151 + n * 27 + j * 19}
                  y={161 + n * 14 - j * 10}
                  s={0.65}
                />
              ))}
            </g>
          ))}
          <Child x={111} y={180} s={0.85} />
          <g transform="translate(274 189)">
            <ellipse rx="20" ry="11" fill="#e7bb68" />
            <path d="M-20-11v11q20 19 40 0v-11" fill="#c89551" />
            <ellipse cy="-11" rx="20" ry="10" fill="#f0c877" />
            {[-10, 0, 10].map((x) => (
              <circle key={x} cx={x} cy="-13" r="6" fill="#df8747" />
            ))}
          </g>
        </g>
      );
    case "ghep-chu":
      return (
        <g>
          <path
            d="M64 210Q199 178 334 210"
            stroke="#c8c3db"
            fill="none"
            strokeWidth="3"
          />
          {[
            ["M", 91, 117, -12, "#b0bfa3"],
            ["Ầ", 166, 91, 5, "#e7b97e"],
            ["M", 241, 129, 13, "#c0a5d2"],
          ].map(([l, x, y, r, c]) => (
            <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
              <rect
                y="8"
                width="73"
                height="79"
                rx="13"
                fill="#a299b4"
                opacity=".3"
              />
              <rect width="73" height="79" rx="13" fill={c} />
              <rect
                x="5"
                y="5"
                width="63"
                height="65"
                rx="10"
                fill="#fff"
                opacity=".18"
              />
              <text
                x="36"
                y="53"
                textAnchor="middle"
                fontSize="40"
                fontWeight="800"
                fill="#fffaf0"
              >
                {l}
              </text>
            </g>
          ))}
          <Sprout x={107} y={96} s={0.85} />
          <Star x={302} y={79} s={0.65} />
          <Star x={63} y={155} s={0.4} />
        </g>
      );
    case "he-mat-troi":
      return (
        <g>
          <ellipse
            cx="203"
            cy="138"
            rx="144"
            ry="55"
            fill="none"
            stroke="#9ba9c5"
            strokeWidth="1.3"
            transform="rotate(-18 203 138)"
          />
          <ellipse
            cx="203"
            cy="138"
            rx="95"
            ry="38"
            fill="none"
            stroke="#a6b2cc"
            transform="rotate(-18 203 138)"
          />
          <circle cx="191" cy="130" r="40" fill="#eeb65c" />
          <circle cx="181" cy="119" r="28" fill="#f4ce78" />
          <circle cx="89" cy="151" r="16" fill="#a3bca5" />
          <circle cx="303" cy="119" r="27" fill="#c69467" />
          <ellipse
            cx="303"
            cy="119"
            rx="44"
            ry="10"
            fill="none"
            stroke="#efd4a6"
            strokeWidth="8"
            transform="rotate(-23 303 119)"
          />
          <circle cx="303" cy="113" r="21" fill="#d3aa81" />
          <circle cx="245" cy="197" r="19" fill="#729ab7" />
          <path d="M231 188q10-9 17 4l-1 10 8 3-13 6-8-11Z" fill="#b4c895" />
          {[
            [60, 82],
            [136, 57],
            [328, 198],
            [290, 51],
            [161, 215],
          ].map(([x, y]) => (
            <Star key={x} x={x} y={y} s={0.25} fill="#fff" />
          ))}
        </g>
      );
    case "lat-the":
      return (
        <g>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <g
              key={n}
              transform={`translate(${81 + (n % 3) * 83} ${52 + Math.floor(n / 3) * 94}) rotate(${n % 2 ? 5 : -5} 34 43)`}
            >
              <rect
                y="5"
                width="68"
                height="83"
                rx="10"
                fill="#c5a5a0"
                opacity=".35"
              />
              <rect
                width="68"
                height="83"
                rx="10"
                fill={n === 1 || n === 5 ? "#fff8ea" : "#da9d96"}
              />
              {n === 1 || n === 5 ? (
                <>
                  <path d="M34 56V33" stroke="#689467" strokeWidth="3" />
                  <ellipse
                    cx="25"
                    cy="37"
                    rx="12"
                    ry="7"
                    fill="#8cb774"
                    transform="rotate(30 25 37)"
                  />
                  <ellipse
                    cx="43"
                    cy="29"
                    rx="12"
                    ry="7"
                    fill="#a9c890"
                    transform="rotate(-30 43 29)"
                  />
                </>
              ) : (
                <>
                  <rect
                    x="7"
                    y="7"
                    width="54"
                    height="69"
                    rx="6"
                    fill="none"
                    stroke="#f3c7bb"
                    strokeWidth="2"
                  />
                  <Star x={34} y={41} s={1} fill="#f8d6bc" />
                </>
              )}
            </g>
          ))}
        </g>
      );
    case "xay-cau":
      return (
        <g>
          <path d="M22 175L140 113 377 171 248 247Z" fill="#9cc6cc" />
          <path d="M22 152L111 113 168 138 76 183Z" fill="#a7c28c" />
          <path d="M256 177L329 135 377 156 307 201Z" fill="#a7c28c" />
          <path d="M87 157L277 176 289 162 100 142Z" fill="#d6b680" />
          <path
            d="M95 154L95 173 138 168 146 184 170 175 178 185 204 177 213 193 241 183 274 194 282 175Z"
            fill="#ad8c59"
          />
          <path
            d="M102 140L275 158M103 127L275 146"
            stroke="#9a835b"
            strokeWidth="4"
          />
          {[103, 132, 161, 190, 219, 248, 275].map((x) => (
            <path
              key={x}
              d={`M${x} ${127 + (x - 103) / 9}v29`}
              stroke="#9a835b"
              strokeWidth="3"
            />
          ))}
          <Tree x={66} y={150} s={0.6} />
          <Tree x={323} y={154} s={0.8} />
          <Child x={149} y={151} s={0.7} />
          <Cloud x={183} y={65} s={0.8} />
        </g>
      );
    case "phan-so":
      return (
        <g>
          <ellipse
            cx="199"
            cy="188"
            rx="102"
            ry="30"
            fill="#cbad8d"
            opacity=".2"
          />
          <ellipse cx="199" cy="165" rx="105" ry="43" fill="#fff8e8" />
          <ellipse cx="198" cy="158" rx="88" ry="34" fill="#d89958" />
          <path d="M111 134V157a88 34 0 00174 0v-23Z" fill="#d5a15e" />
          <ellipse cx="198" cy="132" rx="87" ry="37" fill="#f0c676" />
          <path d="M198 132L274 114Q256 89 216 95Z" fill="#d98051" />
          <path
            d="M198 132L165 99M198 132L113 125M198 132L145 160M198 132L226 167M198 132L282 140M198 132L274 114"
            stroke="#bb874d"
            strokeWidth="2"
          />
          <g transform="rotate(12 308 82)">
            <rect x="270" y="54" width="56" height="62" rx="9" fill="#fff9ed" />
            <text
              x="298"
              y="79"
              fontSize="22"
              textAnchor="middle"
              fill="#ad7554"
              fontWeight="700"
            >
              1
            </text>
            <path d="M286 85H310" stroke="#ad7554" strokeWidth="2" />
            <text
              x="298"
              y="108"
              fontSize="22"
              textAnchor="middle"
              fill="#ad7554"
              fontWeight="700"
            >
              6
            </text>
          </g>
          <Star x={75} y={105} s={0.7} />
        </g>
      );
    case "khoi-hinh":
      return (
        <g>
          <ellipse
            cx="201"
            cy="207"
            rx="126"
            ry="21"
            fill="#afa4ba"
            opacity=".2"
          />
          <Cube
            x={149}
            y={134}
            s={1.32}
            c="#9fb893"
            top="#c7d6b2"
            side="#7f9d78"
          />
          <Cube
            x={228}
            y={165}
            s={0.85}
            c="#e3b477"
            top="#f5d6a0"
            side="#c49460"
          />
          <path d="M215 113L249 43 284 113Z" fill="#bb9fc8" />
          <ellipse cx="249" cy="113" rx="35" ry="15" fill="#a489b5" />
          <circle cx="99" cy="191" r="27" fill="#d79080" />
          <circle cx="91" cy="182" r="17" fill="#e5a391" />
          <path d="M293 151v45a24 11 0 0048 0v-45" fill="#86aab4" />
          <ellipse cx="317" cy="151" rx="24" ry="11" fill="#b3d0d4" />
        </g>
      );
    case "duoi-hinh":
      return (
        <g>
          <rect
            x="72"
            y="57"
            width="167"
            height="123"
            rx="15"
            fill="#fff8dc"
            transform="rotate(-8 155 115)"
          />
          <path d="M99 151l38-44 28 27 25-36 28 49Z" fill="#b3c585" />
          <circle cx="121" cy="91" r="16" fill="#efbc5f" />
          <path
            d="M245 87h72q14 0 14 14v46q0 14-14 14h-35l-19 18v-18h-18q-14 0-14-14v-46q0-14 14-14"
            fill="#dbad64"
          />
          <text
            x="281"
            y="141"
            fill="#fff9e8"
            fontSize="52"
            textAnchor="middle"
            fontWeight="700"
          >
            ?
          </text>
          {[0, 1, 2, 3].map((n) => (
            <rect
              key={n}
              x={107 + n * 48}
              y="191"
              width="36"
              height="31"
              rx="7"
              fill="#fff8dc"
            />
          ))}
          <Star x={316} y={55} s={0.5} />
        </g>
      );
    case "dua-thuyen":
      return (
        <g>
          <path
            d="M0 155Q80 133 160 153T320 149T440 146V260H0Z"
            fill="#9fcdcc"
          />
          <path
            d="M0 199Q80 177 160 197T320 193T440 190"
            fill="none"
            stroke="#c9e5df"
            strokeWidth="3"
          />
          <g transform="translate(180 164) rotate(-10)">
            <path
              d="M-100-8q104 41 208-5l-22 38q-69 31-157 0Z"
              fill="#be754c"
            />
            <path
              d="M-99-8q104 41 207-5"
              fill="none"
              stroke="#efc779"
              strokeWidth="8"
            />
            {[-60, -20, 20, 60].map((x, i) => (
              <g key={x}>
                <Child x={x} y={-3} c={i % 2 ? "#eed08a" : "#568d7e"} s={0.8} />
                <path
                  d={`M${x - 5}-12l-16 57`}
                  stroke="#856b43"
                  strokeWidth="4"
                />
                <path
                  d={`M${x - 21} 36l-5 18`}
                  stroke="#c59861"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </g>
            ))}
            <path d="M86-8v-56" stroke="#a37b4d" strokeWidth="3" />
            <path d="M86-65l31 9-31 12Z" fill="#dd8c63" />
          </g>
          <Cloud x={92} y={61} s={0.7} />
          <Cloud x={286} y={76} s={0.5} />
        </g>
      );
    case "duong-ve-nha":
      return (
        <g>
          <rect x="64" y="58" width="253" height="158" rx="18" fill="#c8d8a8" />
          <path
            d="M83 78H153V109H189V77H296V139H252V196H208V148H150V195H85V144H113V109H84M176 194V127H220V96H269"
            fill="none"
            stroke="#86a568"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path
            d="M93 191V157H126V124H166V90"
            fill="none"
            stroke="#f6edc4"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="5 8"
          />
          <House x={299} y={72} s={0.45} />
          <Child x={92} y={199} s={0.9} />
          <Tree x={334} y={194} s={0.55} />
        </g>
      );
    case "phong-thi-nghiem":
      return (
        <g>
          <path d="M59 182L280 129 345 160 125 216Z" fill="#c3cebe" />
          <path d="M59 182L125 216V228L59 194Z" fill="#a6b3a5" />
          <path d="M125 216L345 160V172L125 228Z" fill="#9fac9e" />
          <path
            d="M112 64h27v48l32 56q8 18-19 23H99q-27-5-19-23l32-56Z"
            fill="#edf5ea"
            stroke="#90ada5"
            strokeWidth="3"
          />
          <path
            d="M98 145l-16 28q0 15 25 14h39q24 0 22-14l-16-28Z"
            fill="#9bbe82"
          />
          <ellipse cx="125" cy="146" rx="27" ry="8" fill="#b7d698" />
          <path
            d="M192 82h43v75q0 26-22 26t-21-26Z"
            fill="#edf5ea"
            stroke="#91b0a7"
            strokeWidth="3"
          />
          <path d="M196 129h35v28q0 22-18 22t-17-22Z" fill="#e5b668" />
          <path
            d="M266 106h31v48q0 21-15 21t-16-21Z"
            fill="#edf5ea"
            stroke="#91b0a7"
            strokeWidth="3"
          />
          <path d="M269 137h25v17q0 18-12 18t-13-18Z" fill="#b2a4c8" />
          {[
            [119, 130],
            [139, 121],
            [214, 115],
            [222, 94],
            [281, 122],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 2 ? 4 : 6}
              fill="#fff"
              opacity=".75"
            />
          ))}
        </g>
      );
    case "nhac-viet":
      return (
        <g>
          <ellipse
            cx="201"
            cy="200"
            rx="102"
            ry="17"
            fill="#b79770"
            opacity=".13"
          />
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <g
              key={n}
              transform={`translate(${87 + n * 32} ${116 - n * 7}) rotate(16)`}
            >
              <rect
                y="7"
                width="25"
                height={63 + n * 8}
                rx="6"
                fill="#a57947"
              />
              <rect
                width="25"
                height={63 + n * 8}
                rx="6"
                fill={
                  [
                    "#df947a",
                    "#e5b76c",
                    "#c9cb82",
                    "#a8c68d",
                    "#8db8ac",
                    "#9baec7",
                    "#b9a3c3",
                  ][n]
                }
              />
              <circle cx="12" cy="9" r="2" fill="#87694c" />
            </g>
          ))}
          <path
            d="M112 70l109 86M157 64l-26 102"
            stroke="#9e7954"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="109" cy="68" r="10" fill="#d0a97a" />
          <circle cx="160" cy="57" r="10" fill="#d0a97a" />
          <path
            d="M287 60v28q-13-6-15 4t15 5V64l22-5v22q-14-4-14 5t16 4V48Z"
            fill="#b3966e"
          />
        </g>
      );
    case "khung-long":
      return (
        <g>
          <path d="M49 207Q175 119 358 195L318 233 96 235Z" fill="#adc88e" />
          <Tree x={83} y={169} s={0.85} />
          <Tree x={324} y={155} s={0.8} />
          <g fill="#78a175">
            <path d="M133 149q-18 22-49 18 31 28 63 8Z" />
            <ellipse cx="193" cy="158" rx="63" ry="37" />
            <path d="M218 153q17-17 14-55t30-41l14 20q-23 5-18 31t-6 62Z" />
            <ellipse cx="263" cy="65" rx="25" ry="16" />
            <path
              d="M157 173v41h18l9-35M220 171v42h19l1-43"
              stroke="#78a175"
              strokeWidth="12"
              strokeLinejoin="round"
            />
          </g>
          <path
            d="M142 140l10-14 9 11 9-15 12 11 11-15 12 15 13-9 6 14"
            fill="#c3d498"
          />
          <circle cx="272" cy="63" r="3" fill="#314b3d" />
          <path d="M270 74h12" stroke="#517c56" strokeWidth="2" />
          <ellipse cx="279" cy="204" rx="18" ry="24" fill="#eadcba" />
          <path
            d="M266 199l10 6 9-8 10 7"
            fill="none"
            stroke="#c1ac8e"
            strokeWidth="2"
          />
        </g>
      );
    case "phan-loai":
      return (
        <g>
          {[
            ["#d7aa70", 88],
            ["#8db59b", 228],
          ].map(([c, x]) => (
            <g key={x}>
              <path d={`M${x} 142h91l-9 67h-74Z`} fill={c} />
              <rect x={x - 5} y="135" width="101" height="15" rx="7" fill={c} />
              <ellipse
                cx={x + 45}
                cy="177"
                rx="14"
                ry="13"
                fill="#fff"
                opacity=".3"
              />
            </g>
          ))}
          <g transform="translate(124 98)">
            <circle r="21" fill="#d88867" />
            <path d="M0-15v-13" stroke="#8a7753" strokeWidth="4" />
            <path d="M1-23q15-18 22-7Q15-14 1-23" fill="#8dac73" />
          </g>
          <Sprout x={273} y={108} s={1.1} />
          <path d="M192 66l15 25-15 25-15-25Z" fill="#ccb97f" />
          <path
            d="M190 146l-18 22m31-22l18 22"
            stroke="#b5bc92"
            strokeWidth="3"
            strokeDasharray="4 5"
          />
        </g>
      );
    case "ban-do-viet":
      return (
        <g>
          <path d="M63 200L199 90 348 192 199 240Z" fill="#b1cfb6" />
          <path d="M92 203L184 128 287 190 196 221Z" fill="#d0dfb7" />
          <path
            d="M256 107q39 30 51 64l-35 34"
            fill="none"
            stroke="#91bec2"
            strokeWidth="24"
          />
          <House x={128} y={182} s={0.56} />
          <Tree x={97} y={185} s={0.55} />
          <g transform="translate(219 126)">
            <path d="M-27 47h56v-9H-27Z" fill="#d5b88a" />
            <path d="M-18 37V3H18V37" fill="#f2dbad" />
            <path d="M-23 5L0-21 24 5Z" fill="#a8795c" />
            <path d="M-12 3L0-12 12 3Z" fill="#bb8f6a" />
            <path d="M-5 36V19q5-9 10 0v17" fill="#947c5d" />
            <path d="M-29 48H29" stroke="#9d8864" strokeWidth="4" />
          </g>
          <Tree x={292} y={208} s={0.65} />
          <g transform="translate(169 57)">
            <path d="M0 34Q-28 9-18-9T18-9Q28 9 0 34" fill="#d78e6d" />
            <circle r="8" fill="#fff0cf" />
          </g>
          <Cloud x={304} y={55} s={0.55} />
        </g>
      );
    case "sudoku":
      return (
        <g transform="rotate(-8 200 130)">
          <rect
            x="110"
            y="40"
            width="184"
            height="189"
            rx="12"
            fill="#b4a9c2"
          />
          <rect
            x="105"
            y="34"
            width="184"
            height="189"
            rx="12"
            fill="#fff9ef"
          />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <g key={`${r}${c}`}>
                <rect
                  x={114 + c * 43}
                  y={43 + r * 43}
                  width="39"
                  height="39"
                  rx="5"
                  fill={
                    r === 1 && c === 2
                      ? "#9a85b0"
                      : ["#e9dfed", "#d9e4d3", "#f2dfbd", "#e6c9c3"][
                          (r * 2 + c) % 4
                        ]
                  }
                />
                <text
                  x={133 + c * 43}
                  y={72 + r * 43}
                  textAnchor="middle"
                  fill={r === 1 && c === 2 ? "#fff" : "#6b6077"}
                  fontWeight="700"
                  fontSize="25"
                >
                  {r === 1 && c === 2
                    ? "?"
                    : ((r * 2 + Math.floor(r / 2) + c) % 4) + 1}
                </text>
              </g>
            )),
          )}
          <Star x={76} y={112} s={0.6} />
          <Star x={323} y={171} s={0.5} />
        </g>
      );
    case "thanh-pho-xanh":
      return (
        <g>
          <path d="M46 179L217 94 352 169 187 245Z" fill="#a6c88f" />
          <path
            d="M68 190L192 126 294 182"
            fill="none"
            stroke="#e6dfba"
            strokeWidth="18"
          />
          <g transform="translate(136 121)">
            <path d="M-26-34L10-15V61L-26 40Z" fill="#efd7ac" />
            <path d="M10-15L38-29V47L10 61Z" fill="#d8c194" />
            <path d="M-26-34L1-48 38-29 10-15Z" fill="#aac78c" />
            {[0, 1, 2].map((n) => (
              <path
                key={n}
                d={`M-17 ${-18 + n * 23}l15 8v10l-15-8Z`}
                fill="#91b6b0"
              />
            ))}
          </g>
          <House x={233} y={165} s={0.65} roof="#89aaa3" />
          <Tree x={74} y={179} s={0.66} />
          <Tree x={288} y={180} s={1} />
          <Tree x={212} y={221} s={0.65} />
          <path
            d="M281 101V50M281 50L266 39M281 50L298 42M281 50L278 71"
            stroke="#f8f7df"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="281" cy="50" r="4" fill="#bdd2c1" />
          <Cloud x={214} y={49} s={0.5} />
        </g>
      );
    case "mat-ma":
      return (
        <g>
          <ellipse
            cx="198"
            cy="212"
            rx="99"
            ry="19"
            fill="#c4a47a"
            opacity=".18"
          />
          <path d="M114 121h169v79q-85 28-169 0Z" fill="#b78853" />
          <path d="M114 125q0-71 85-71t84 71Z" fill="#c99c60" />
          <path d="M119 124h159" stroke="#956c43" strokeWidth="5" />
          <path
            d="M145 65q-12 21-12 60v80M253 65q12 21 12 60v80"
            stroke="#efd089"
            strokeWidth="13"
          />
          <path
            d="M114 191q85 27 169 0"
            fill="none"
            stroke="#966b43"
            strokeWidth="5"
          />
          <rect x="179" y="112" width="40" height="43" rx="7" fill="#ebc36d" />
          <circle cx="199" cy="129" r="6" fill="#9d784a" />
          <path d="M199 131v12" stroke="#9d784a" strokeWidth="5" />
          <Star x={89} y={79} s={0.8} />
          <Star x={309} y={122} s={0.5} />
          <Star x={285} y={44} s={0.45} />
        </g>
      );
    case "den-long":
      return (
        <g>
          <circle cx="289" cy="63" r="27" fill="#f5e4b5" />
          <path
            d="M0 60Q199 128 400 60"
            fill="none"
            stroke="#8f7890"
            strokeWidth="2"
          />
          {[
            [89, 81, "#cd8c71"],
            [194, 97, "#e0b56d"],
            [309, 84, "#b394bc"],
          ].map(([x, y, c], i) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <path d="M0 0v18" stroke="#89738e" strokeWidth="2" />
              <ellipse cy="53" rx={i === 1 ? 31 : 25} ry="36" fill={c} />
              <ellipse
                cy="53"
                rx="14"
                ry="36"
                fill="none"
                stroke="#fff1ce"
                opacity=".5"
                strokeWidth="2"
              />
              <path d="M-16 19H16M-16 87H16" stroke="#98734f" strokeWidth="4" />
              <path d="M0 89v26m-5-13v15m10-15v15" stroke={c} strokeWidth="3" />
              <ellipse cy="46" rx="10" ry="19" fill="#fff5ca" opacity=".19" />
            </g>
          ))}
          <path
            d="M0 245L0 219 58 189 114 219 163 203 214 227 272 197 337 215 400 191V260H0Z"
            fill="#b4a3bc"
          />
          <path
            d="M18 221l40-22 38 23M244 227l28-21 46 16"
            stroke="#94859e"
            strokeWidth="6"
            fill="none"
          />
        </g>
      );
    default:
      return null;
  }
}
export default function GameArt({ id = "hero", className = "" }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      className={`game-art ${id === "hero" ? "game-art-hero" : ""} ${className}`}
      viewBox={id === "hero" ? "0 0 620 390" : "0 0 400 260"}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="6"
            floodColor="#4c5a36"
            floodOpacity=".08"
          />
        </filter>
      </defs>
      <g filter={`url(#soft-${uid})`}>
        {id === "hero" ? <Village /> : <Scene id={id} />}
      </g>
    </svg>
  );
}
