#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_vldc_database.py
Trích xuất, biên soạn và chuẩn hóa toàn bộ Ngân hàng câu hỏi & Cơ sở tri thức môn VẬT LÝ ĐẠI CƯƠNG 2 / VẬT LÝ A3
Dựa trên tài liệu gốc:
- VLDC/LY_A3.pdf
- VLDC/giao thoa ánh sáng-1.pdf
- VLDC/nhiễu xạ-1.pdf
- VLDC/Quang lượng tử.pdf
- VLDC/cơ học lượng tử.pdf
- Notion: https://app.notion.com/p/V-t-l-i-c-ng-2-26ffd98e1f09818a8a1ecb0d91c7afb1
"""

import json
import os
import re

def build_knowledge_base():
    kb = {
        "subject": "Vật Lý Đại Cương 2 (Vật Lý A3)",
        "code": "VLDC2_KMA",
        "chapters": [
            {
                "id": 1,
                "title": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
                "summary": "Nghiên cứu hiện tượng giao thoa của hai hay nhiều sóng ánh sáng kết hợp, sự phân bố cực đại (vân sáng) và cực tiểu (vân tối), giao thoa khe Young, giao thoa bản mỏng nêm không khí và vân tròn Newton.",
                "core_formulas": [
                    {
                        "name": "Hiệu quang lộ khe Young",
                        "formula": "ΔL = L2 - L1 = (a * x) / D",
                        "desc": "Trong đó a là khoảng cách 2 khe, D là khoảng cách từ 2 khe đến màn, x là tọa độ điểm trên màn."
                    },
                    {
                        "name": "Vị trí vân sáng & vân tối",
                        "formula": "Vân sáng: xs = k * (λ * D / a); Vân tối: xt = (k + 0.5) * (λ * D / a)",
                        "desc": "k là bậc giao thoa (k = 0, ±1, ±2...)."
                    },
                    {
                        "name": "Khoảng vân giao thoa",
                        "formula": "i = (λ * D) / a",
                        "desc": "Khoảng cách giữa hai vân sáng liên tiếp hoặc hai vân tối liên tiếp."
                    },
                    {
                        "name": "Độ dịch vân khi đặt bản mỏng",
                        "formula": "Δx = (D / a) * (n - 1) * e",
                        "desc": "Đặt bản mỏng bề dày e, chiết suất n trước một trong hai khe. Hệ vân dịch về phía khe có đặt bản mỏng."
                    },
                    {
                        "name": "Độ dịch vân khi dịch chuyển nguồn S",
                        "formula": "Δx = (D / d) * y0",
                        "desc": "Nguồn S dịch một đoạn y0 vuông góc với trục đối xứng, khoảng cách nguồn đến khe là d. Hệ vân dịch ngược chiều y0."
                    },
                    {
                        "name": "Giao thoa nêm không khí",
                        "formula": "Khoảng vân: i = λ / (2 * α); Vân tối: dk = k * λ / 2",
                        "desc": "α là góc nghiêng của nêm (rad). Cạnh nêm (d = 0) luôn là vân tối do phản xạ trên môi trường chiết quang hơn bị mất nửa bước sóng (λ/2)."
                    },
                    {
                        "name": "Vân tròn Newton (ánh sáng phản xạ)",
                        "formula": "Vân tối: rk = √(k * R * λ); Vân sáng: rk = √((k - 0.5) * R * λ)",
                        "desc": "R là bán kính cong của thấu kính phẳng - lồi. Tâm hệ vân (k = 0) là một điểm tối."
                    }
                ],
                "magic_keywords": [
                    {"kw": "Nguồn S dịch chuyển", "meaning": "Hệ vân dịch ngược chiều: Δx = (D/d)*y0"},
                    {"kw": "Bản mặt song song", "meaning": "Hệ vân dịch về phía khe có bản: Δx = (D/a)*(n-1)*e"},
                    {"kw": "Mất nửa bước sóng (λ/2)", "meaning": "Xảy ra khi phản xạ trên môi trường chiết quang hơn (n2 > n1)"},
                    {"kw": "Cạnh nêm không khí", "meaning": "Luôn là VÂN TỐI vì hiệu quang lộ ΔL = 2*d + λ/2 = λ/2"},
                    {"kw": "Tâm vân tròn Newton phản xạ", "meaning": "Luôn là ĐIỂM TỐI (do phản xạ tại lớp không khí tiếp xúc bị cộng thêm λ/2)"}
                ]
            },
            {
                "id": 2,
                "title": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
                "summary": "Hiện tượng tia sáng bị lệch khỏi phương truyền thẳng khi đi qua các vật chướng ngại có kích thước cỡ bước sóng. Phương pháp đới cầu Fresnel, nhiễu xạ qua lỗ tròn, đĩa tròn Arago, nhiễu xạ sóng phẳng qua một khe hẹp và cách mạng nhiễu xạ.",
                "core_formulas": [
                    {
                        "name": "Bán kính đới cầu Fresnel thứ k",
                        "formula": "rk = √((k * a * b * λ) / (a + b))",
                        "desc": "a là khoảng cách từ nguồn điểm đến mặt cầu, b là khoảng cách từ mặt cầu đến điểm quan sát M. Sóng phẳng (a → ∞): rk = √(k * b * λ)."
                    },
                    {
                        "name": "Diện tích đới cầu Fresnel",
                        "formula": "ΔS ≈ (π * a * b * λ) / (a + b)",
                        "desc": "Diện tích các đới cầu xấp xỉ bằng nhau và không phụ thuộc vào số thứ tự đới k."
                    },
                    {
                        "name": "Nhiễu xạ qua lỗ tròn",
                        "formula": "m = R0² * (a + b) / (a * b * λ)",
                        "desc": "m là số đới cầu mở ra. Nếu m lẻ: tâm M sáng cực đại (I = 4*I1 với m=1). Nếu m chẵn: tâm M tối (I ≈ 0 với m=2)."
                    },
                    {
                        "name": "Nhiễu xạ qua đĩa tròn (Điểm Arago)",
                        "formula": "Tâm hình học luôn là ĐIỂM SÁNG",
                        "desc": "Dao động tại M do các đới cầu còn lại (bắt đầu từ đới k+1) tạo ra: A ≈ Ak+1 / 2 > 0."
                    },
                    {
                        "name": "Nhiễu xạ sóng phẳng qua 1 khe hẹp (Fraunhofer)",
                        "formula": "Cực tiểu: b * sin(φ) = k * λ; Cực đại: b * sin(φ) = (2k + 1) * (λ / 2)",
                        "desc": "b là bề rộng khe hẹp, φ là góc nhiễu xạ, k = ±1, ±2... Bề rộng cực đại giữa bằng 2 lần cực đại phụ."
                    },
                    {
                        "name": "Cách tử nhiễu xạ (Diffraction Grating)",
                        "formula": "d * sin(φ) = k * λ (với d = a + b là chu kỳ cách tử)",
                        "desc": "Số cực đại chính quan sát được: |k| ≤ d / λ. Tổng số cực đại chính: N = 2 * [d/λ] + 1."
                    }
                ],
                "magic_keywords": [
                    {"kw": "Lỗ tròn chứa số đới LẺ", "meaning": "Tâm là VÂN SÁNG (m=1 sáng gấp 4 lần khi không có màn)"},
                    {"kw": "Lỗ tròn chứa số đới CHẴN", "meaning": "Tâm là VÂN TỐI (m=2 cường độ xấp xỉ 0)"},
                    {"kw": "Đĩa tròn chắn sáng", "meaning": "Tâm bóng tối luôn có ĐIỂM SÁNG ARAGO (Poisson spot)"},
                    {"kw": "Số cực đại cách tử", "meaning": "k_max = phần nguyên của d/λ; Tổng cực đại = 2*k_max + 1"},
                    {"kw": "Bề rộng cực đại giữa khe hẹp", "meaning": "Δx0 = 2 * (λ * f / b)"}
                ]
            },
            {
                "id": 3,
                "title": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
                "summary": "Bản chất sóng ngang của ánh sáng. Sự khác biệt giữa ánh sáng tự nhiên và ánh sáng phân cực. Phân cực do phản xạ, khúc xạ và lưỡng chiết. Định luật Malus và định luật Brewster.",
                "core_formulas": [
                    {
                        "name": "Định luật Malus (Maluyt)",
                        "formula": "I = I0 * cos²(α)",
                        "desc": "I0 là cường độ ánh sáng phân cực tới kính phân tích, α là góc giữa quang trục của kính phân cực và kính phân tích. Khi α = 0°: I = I0; khi α = 90°: I = 0 (tắt sáng)."
                    },
                    {
                        "name": "Định luật Brewster",
                        "formula": "tan(iB) = n2 / n1 = n21",
                        "desc": "Khi góc tới bằng góc Brewster iB, tia phản xạ là ánh sáng phân cực thẳng hoàn toàn (vector E vuông góc mặt phẳng tới). Tia phản xạ vuông góc tia khúc xạ: iB + r = 90°."
                    },
                    {
                        "name": "Ánh sáng tự nhiên qua kính phân cực lý tưởng",
                        "formula": "I1 = I_tn / 2",
                        "desc": "Cường độ ánh sáng giảm một nửa khi biến thành ánh sáng phân cực phẳng."
                    },
                    {
                        "name": "Hệ 2 kính phân cực quay góc α",
                        "formula": "I = (I_tn / 2) * cos²(α)",
                        "desc": "Cường độ chùm sáng thoát ra khỏi kính thứ 2 khi chiếu ánh sáng tự nhiên ban đầu."
                    }
                ],
                "magic_keywords": [
                    {"kw": "Góc Brewster iB", "meaning": "tan(iB) = n2/n1; Tia phản xạ vuông góc tia khúc xạ (iB + r = 90°)"},
                    {"kw": "Tia phản xạ ở góc Brewster", "meaning": "Phân cực thẳng HOÀN TOÀN (vector dao động vuông góc mặt phẳng tới)"},
                    {"kw": "Kính phân cực & Kính phân tích bắt chéo (α = 90°)", "meaning": "Cường độ I = 0 (không có ánh sáng lọt qua)"},
                    {"kw": "Lưỡng chiết", "meaning": "Tách thành 2 tia: tia thường (o - tuân theo định luật khúc xạ) và tia bất thường (e)"}
                ]
            },
            {
                "id": 4,
                "title": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
                "summary": "Bức xạ nhiệt cân bằng, vật đen tuyệt đối, định luật Stefan-Boltzmann, định luật dịch chuyển Wien. Thuyết lượng tử Planck, thuyết photon Einstein, hiện tượng quang điện ngoài và hiệu ứng tán xạ Compton.",
                "core_formulas": [
                    {
                        "name": "Định luật Stefan - Boltzmann",
                        "formula": "R = σ * T⁴",
                        "desc": "Năng suất phát xạ toàn phần của vật đen tuyệt đối tỉ lệ với lũy thừa 4 của nhiệt độ tuyệt đối. Hằng số Stefan-Boltzmann σ = 5.67 * 10⁻⁸ W/(m²·K⁴)."
                    },
                    {
                        "name": "Định luật dịch chuyển Wien",
                        "formula": "λm * T = b",
                        "desc": "Bước sóng ứng với năng suất phát xạ cực đại tỉ lệ nghịch với nhiệt độ. Hằng số Wien b = 2.898 * 10⁻³ m·K."
                    },
                    {
                        "name": "Năng lượng photon & Động lượng photon",
                        "formula": "ε = h * ν = (h * c) / λ; p = h / λ = ε / c",
                        "desc": "Hằng số Planck h = 6.625 * 10⁻³⁴ J·s, c = 3 * 10⁸ m/s. 1 eV = 1.6 * 10⁻¹⁹ J."
                    },
                    {
                        "name": "Phương trình quang điện Einstein",
                        "formula": "h * ν = A + 0.5 * m * v0max² = A + e * Uh",
                        "desc": "A = hc / λ0 là công thoát của electron, λ0 là giới hạn quang điện, Uh là hiệu điện thế hãm."
                    },
                    {
                        "name": "Độ tăng bước sóng Compton",
                        "formula": "Δλ = λ' - λ = 2 * λc * sin²(θ / 2) = λc * (1 - cos θ)",
                        "desc": "λc = h / (m0 * c) = 2.426 * 10⁻¹² m = 0.02426 Å là bước sóng Compton của electron. θ là góc tán xạ của photon."
                    },
                    {
                        "name": "Động năng electron giật lùi trong Compton",
                        "formula": "Ke = h * c * (1 / λ - 1 / λ')",
                        "desc": "Được xác định theo định luật bảo toàn năng lượng toàn phần."
                    }
                ],
                "magic_keywords": [
                    {"kw": "Nhiệt độ T tăng k lần", "meaning": "Năng suất phát xạ R tăng k⁴ lần; λm giảm k lần"},
                    {"kw": "Điều kiện quang điện ngoài", "meaning": "λ ≤ λ0 hoặc hν ≥ A; không phụ thuộc cường độ chùm sáng"},
                    {"kw": "Hiệu điện thế hãm Uh", "meaning": "e*Uh = 0.5*m*v0max² = hν - A (chỉ phụ thuộc tần số ánh sáng và bản chất kim loại)"},
                    {"kw": "Tán xạ Compton góc θ = 180°", "meaning": "Δλ đạt cực đại: Δλmax = 2*λc ≈ 0.0485 Å; động năng electron giật lùi cực đại"}
                ]
            },
            {
                "id": 5,
                "title": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
                "summary": "Giả thuyết De Broglie về lưỡng tính sóng - hạt của vật chất vi mô. Hệ thức bất định Heisenberg. Hàm sóng Schrödinger và ý nghĩa thống kê Born. Khảo sát hạt trong giếng thế thế năng một chiều sâu vô hạn.",
                "core_formulas": [
                    {
                        "name": "Bước sóng De Broglie",
                        "formula": "λ = h / p = h / (m * v) = h / √(2 * m * Wđ)",
                        "desc": "Với electron phi tương đối tính được gia tốc bởi U: λ = h / √(2 * m * e * U) = 12.27 / √U (Å)."
                    },
                    {
                        "name": "Hệ thức bất định Heisenberg",
                        "formula": "Δx * Δpx ≥ ħ / 2 ≈ ħ; ΔE * Δt ≥ ħ",
                        "desc": "ħ = h / (2π) = 1.055 * 10⁻³⁴ J·s. Không thể đồng thời xác định chính xác vị trí và xung lượng của vi hạt."
                    },
                    {
                        "name": "Hạt trong giếng thế 1 chiều sâu vô hạn (bề rộng a)",
                        "formula": "Mức năng lượng: En = (n² * π² * ħ²) / (2 * m * a²) = (n² * h²) / (8 * m * a²)",
                        "desc": "n = 1, 2, 3... là số lượng tử. Năng lượng hạt bị lượng tử hóa (gián đoạn). Năng lượng trạng thái cơ bản E1 = h² / (8*m*a²)."
                    },
                    {
                        "name": "Hàm sóng dừng trong giếng thế",
                        "formula": "ψn(x) = √(2 / a) * sin((n * π * x) / a)",
                        "desc": "Với 0 ≤ x ≤ a. Ngoài giếng (x < 0 hoặc x > a): ψ(x) = 0."
                    },
                    {
                        "name": "Xác suất tìm hạt",
                        "formula": "dw = |ψ(x)|² * dx; w = ∫ |ψ(x)|² dx",
                        "desc": "|ψ(x)|² là mật độ xác suất tìm hạt tại tọa độ x."
                    }
                ],
                "magic_keywords": [
                    {"kw": "Electron gia tốc bởi U (Vôn)", "meaning": "Bấm nhanh Casio: λ = 12.27 / √U (Å)"},
                    {"kw": "Năng lượng kích thích giếng thế", "meaning": "ΔE = E2 - E1 = (2² - 1²)*E1 = 3*E1; E3 - E1 = 8*E1"},
                    {"kw": "Điểm nút xác suất trong giếng", "meaning": "Ở mức n, có n - 1 nút xác suất bằng 0 bên trong giếng"},
                    {"kw": "Trạng thái cơ bản giếng thế (n = 1)", "meaning": "Xác suất cực đại tại chính giữa giếng x = a/2"}
                ]
            },
            {
                "id": 6,
                "title": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
                "summary": "Tiên đề Bo về nguyên tử Hydro, các mức năng lượng và dãy quang phổ. Cấu tạo hạt nhân, độ hụt khối, năng lượng liên kết và định luật phóng xạ.",
                "core_formulas": [
                    {
                        "name": "Mức năng lượng nguyên tử Hydro (Mẫu Bo)",
                        "formula": "En = -13.6 / n² (eV)",
                        "desc": "Bán kính quỹ đạo dừng: rn = n² * r0 (với r0 = 0.53 Å là bán kính Bo)."
                    },
                    {
                        "name": "Bước sóng quang phổ Hydro",
                        "formula": "1 / λ = R_H * (1 / m² - 1 / n²)",
                        "desc": "Dãy Lyman (về m=1, vùng tử ngoại); Dãy Balmer (về m=2, vùng khả kiến); Dãy Paschen (về m=3, vùng hồng ngoại)."
                    },
                    {
                        "name": "Độ hụt khối & Năng lượng liên kết hạt nhân",
                        "formula": "Δm = [Z * mp + (A - Z) * mn] - mX; Elk = Δm * c²",
                        "desc": "Năng lượng liên kết riêng: ε = Elk / A (đặc trưng cho độ bền vững của hạt nhân)."
                    },
                    {
                        "name": "Định luật phân rã phóng xạ",
                        "formula": "N(t) = N0 * e^(-λ * t) = N0 * 2^(-t / T)",
                        "desc": "Chu kỳ bán rã: T = ln(2) / λ ≈ 0.693 / λ. Độ phóng xạ: H(t) = λ * N(t)."
                    }
                ],
                "magic_keywords": [
                    {"kw": "Dãy Lyman", "meaning": "Chuyển về n = 1 (Vùng TỬ NGOẠI)"},
                    {"kw": "Dãy Balmer", "meaning": "Chuyển về n = 2 (Vùng KHẢ KIẾN - Ánh sáng nhìn thấy: Hα, Hβ, Hγ, Hδ)"},
                    {"kw": "Dãy Paschen", "meaning": "Chuyển về n = 3 (Vùng HỒNG NGOẠI)"},
                    {"kw": "Độ bền vững hạt nhân", "meaning": "Phụ thuộc vào NĂNG LƯỢNG LIÊN KẾT RIÊNG (Elk / A), bền nhất cỡ A = 50 - 70"}
                ]
            }
        ],
        "casio_handbook": [
            {
                "title": "Bấm Hằng Số Vật Lý (CONST) trên Casio fx-580VNX",
                "steps": "Bấm [SHIFT] -> [7] (CONST) -> Chọn danh mục:\n- Universal: h = 6.626*10⁻³⁴ [1], c = 2.998*10⁸ [2]\n- Electromagnetic: e = 1.602*10⁻¹⁹ [1]\n- Atomic & Nuclear: me = 9.109*10⁻³¹ [1], mp = 1.673*10⁻²⁷ [2], mn = 1.675*10⁻²⁷ [3]\n- Physico-Chem: k = 1.381*10⁻²³ [1], σ = 5.670*10⁻⁸ [3]"
            },
            {
                "title": "Chuyển Đổi Đơn Vị (CONV) trên fx-580VNX",
                "steps": "Bấm [SHIFT] -> [8] (CONV) -> Chọn nhóm:\n- Length: Ångström (Å) sang mét (m)\n- Energy: Joule (J) sang electron-Volt (eV): Bấm giá trị J chia cho [SHIFT 7 2 1] (e) -> ra eV!"
            },
            {
                "title": "Mẹo Tính Nhanh Bước Sóng De Broglie",
                "steps": "Electron gia tốc qua hiệu điện thế U: Gõ 12.27 / √(U) -> Kết quả ngay đơn vị Ångström (1 Å = 10⁻¹⁰ m)."
            },
            {
                "title": "Mẹo Tính Tán Xạ Compton",
                "steps": "Δλ = 0.02426 * (1 - cos(θ)) (Å). Bấm máy đặt góc DEG (Độ). Góc 60°: cos = 0.5 -> Δλ = 0.01213 Å. Góc 90°: Δλ = 0.02426 Å. Góc 180°: Δλ = 0.04852 Å."
            }
        ]
    }
    return kb

def build_questions_list():
    questions = []
    
    # -------------------------------------------------------------
    # CHƯƠNG 1: GIAO THOA ÁNH SÁNG
    # -------------------------------------------------------------
    questions.append({
        "id": "VLDC_001",
        "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
        "chapter_id": 1,
        "type": "mcq",
        "prompt": "Trong thí nghiệm giao thoa khe Young, khoảng cách hai khe là a = 1 mm, khoảng cách từ hai khe tới màn quan sát là D = 3 m. Khi đặt trong không khí, đo được khoảng cách giữa 5 vân sáng liên tiếp là 7.2 mm. Bước sóng ánh sáng sử dụng bằng bao nhiêu?",
        "options": [
            "A. 0.60 µm",
            "B. 0.48 µm",
            "C. 0.50 µm",
            "D. 0.72 µm"
        ],
        "correct_answer": "A",
        "correct_answer_text": "0.60 µm",
        "explanation": "Khoảng cách giữa 5 vân sáng liên tiếp tương ứng với 4 khoảng vân (4i):\n4i = 7.2 mm ⇒ i = 7.2 / 4 = 1.8 mm = 1.8 × 10⁻³ m.\nTheo công thức khoảng vân giao thoa:\ni = (λ * D) / a ⇒ λ = (i * a) / D = (1.8 × 10⁻³ m * 10⁻³ m) / 3 m = 0.6 × 10⁻⁶ m = 0.60 µm.",
        "methodology": "Công thức cốt lõi: N vân sáng liên tiếp có (N - 1) khoảng vân. Khoảng vân i = (λ * D) / a.",
        "tips": "Mẹo Casio: Đổi mm sang m, bấm (7.2 / 4 * 1) / 3 = 0.6 µm."
    })

    questions.append({
        "id": "VLDC_002",
        "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
        "chapter_id": 1,
        "type": "mcq",
        "prompt": "Để đo bề dày e của một bản mỏng trong suốt (chiết suất n = 1.5), người ta đặt bản mỏng trước một trong hai khe của máy giao thoa Young. Ánh sáng chiếu vào có bước sóng λ = 0.6 µm. Khi đặt bản mỏng vào, hệ vân bị dịch chuyển một đoạn bằng 10 khoảng vân. Bề dày e của bản mỏng là:",
        "options": [
            "A. 12.0 µm",
            "B. 6.0 µm",
            "C. 15.0 µm",
            "D. 9.0 µm"
        ],
        "correct_answer": "A",
        "correct_answer_text": "12.0 µm",
        "explanation": "Khi đặt bản mỏng bề dày e, chiết suất n trước một khe, hiệu quang lộ tăng thêm một lượng ΔL = (n - 1)e.\nĐộ dịch chuyển của hệ vân trên màn là: Δx = (D / a) * (n - 1)e.\nMà khoảng vân i = (λ * D) / a, nên: Δx = (n - 1)e * (i / λ).\nTheo đề bài, hệ vân dịch chuyển 10 khoảng vân (Δx = 10i):\n10i = (n - 1)e * (i / λ) ⇒ (n - 1)e = 10λ ⇒ e = (10 * λ) / (n - 1) = (10 * 0.6 µm) / (1.5 - 1) = 6 / 0.5 = 12.0 µm.",
        "methodology": "Công thức đo bề dày bản mỏng bằng giao thoa khe Young: e = (k * λ) / (n - 1) khi hệ vân dịch chuyển k khoảng vân.",
        "tips": "Mẹo nhớ: Mỗi lần vân dịch 1 khoảng vân, quang lộ tăng đúng 1 bước sóng λ: (n - 1)e = k*λ."
    })

    questions.append({
        "id": "VLDC_003",
        "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
        "chapter_id": 1,
        "type": "mcq",
        "prompt": "Chiếu chùm ánh sáng đơn sắc có bước sóng λ = 0.6 µm vuông góc với một nêm không khí. Quan sát trong ánh sáng phản xạ, người ta thấy trên 1 cm chiều dài của mặt nêm có 20 khoảng vân. Góc nghiêng α giữa hai mặt nêm bằng bao nhiêu?",
        "options": [
            "A. 6 × 10⁻⁴ rad",
            "B. 3 × 10⁻⁴ rad",
            "C. 1.2 × 10⁻³ rad",
            "D. 1.5 × 10⁻⁴ rad"
        ],
        "correct_answer": "A",
        "correct_answer_text": "6 × 10⁻⁴ rad",
        "explanation": "Trên 1 cm (0.01 m) có 20 khoảng vân ⇒ khoảng vân trên nêm: i = 1 cm / 20 = 0.05 cm = 5 × 10⁻⁴ m.\nCông thức khoảng vân của nêm không khí: i = λ / (2 * α) (với α tính bằng radian).\nSuy ra góc nghiêng α của nêm:\nα = λ / (2 * i) = (0.6 × 10⁻⁶ m) / (2 * 5 × 10⁻⁴ m) = 0.6 × 10⁻⁶ / 10⁻³ = 6 × 10⁻⁴ rad.",
        "methodology": "Khoảng vân của nêm góc nghiêng α: i = λ / (2*n*α). Với nêm không khí n = 1 nên i = λ / (2α).",
        "tips": "Nhớ công thức: α = λ / (2*i). Góc nêm tỉ lệ nghịch với khoảng vân (nêm càng dốc thì vân càng sít nhau)."
    })

    questions.append({
        "id": "VLDC_004",
        "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
        "chapter_id": 1,
        "type": "mcq",
        "prompt": "Trong thí nghiệm vân tròn Newton tạo bởi thấu kính phẳng - lồi đặt trên bản thủy tinh phẳng, bán kính mặt cong thấu kính là R = 10 m, chiếu ánh sáng bước sóng λ = 0.5 µm. Bán kính của vân tối thứ 4 trong chùm tia phản xạ bằng bao nhiêu?",
        "options": [
            "A. 4.47 mm",
            "B. 3.16 mm",
            "C. 2.00 mm",
            "D. 5.25 mm"
        ],
        "correct_answer": "A",
        "correct_answer_text": "4.47 mm",
        "explanation": "Trong ánh sáng phản xạ, bán kính vân tối thứ k của vân tròn Newton được tính bởi công thức:\nrk = √(k * R * λ).\nVới k = 4, R = 10 m, λ = 0.5 µm = 0.5 × 10⁻⁶ m:\nr4 = √(4 * 10 * 0.5 × 10⁻⁶) = √(20 × 10⁻⁶) = √(2 × 10⁻⁵) ≈ 4.472 × 10⁻³ m = 4.47 mm.",
        "methodology": "Vân tròn Newton phản xạ: Vân tối rk = √(k*R*λ), Vân sáng rk = √((k - 0.5)*R*λ). Tâm hệ vân k = 0 luôn là điểm tối.",
        "tips": "Bấm Casio: √(4 * 10 * 0.5 * 10^-6) = 4.47*10^-3 m = 4.47 mm."
    })

    questions.append({
        "id": "VLDC_005",
        "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
        "chapter_id": 1,
        "type": "mcq",
        "prompt": "Tại sao cạnh của nêm không khí và tâm của hệ vân tròn Newton quan sát trong ánh sáng phản xạ luôn luôn là vân tối?",
        "options": [
            "A. Do khi phản xạ tại bề mặt môi trường chiết quang hơn, sóng ánh sáng bị mất nửa bước sóng (đổi pha π)",
            "B. Do năng lượng ánh sáng tại mép nêm và tâm tiếp xúc bị hấp thụ hoàn toàn",
            "C. Do hiệu đường đi hình học tại đó bằng đúng một bước sóng",
            "D. Do chiết suất của lớp không khí tại đó bằng 0"
        ],
        "correct_answer": "A",
        "correct_answer_text": "Do khi phản xạ tại bề mặt môi trường chiết quang hơn, sóng ánh sáng bị mất nửa bước sóng (đổi pha π)",
        "explanation": "Tại cạnh nêm (bề dày d = 0) và tâm tiếp xúc của vân tròn Newton (d = 0), hiệu đường đi hình học bằng 0.\nTuy nhiên, tia sáng phản xạ tại mặt dưới của nêm (phản xạ trên mặt thủy tinh chiết quang hơn không khí, n_tt > n_kk) bị đổi pha π, tương đương quang lộ tăng thêm λ/2.\nDo đó hiệu quang lộ thực tế là: ΔL = 2d + λ/2 = 0 + λ/2 = λ/2.\nHiệu quang lộ bằng nửa bước sóng tương ứng với điều kiện cực tiểu giao thoa, do đó tại đó luôn là VÂN TỐI.",
        "methodology": "Nguyên lý phản xạ sóng: Sóng phản xạ từ môi trường chiết quang kém sang môi trường chiết quang hơn bị đảo pha π (cộng thêm λ/2 vào quang lộ).",
        "tips": "Quy tắc vàng: Phản xạ trên mặt chiết quang hơn ⇒ Mất nửa bước sóng (λ/2) ⇒ Tâm tiếp xúc d = 0 luôn TỐI."
    })

    # -------------------------------------------------------------
    # CHƯƠNG 2: NHIỄU XẠ ÁNH SÁNG
    # -------------------------------------------------------------
    questions.append({
        "id": "VLDC_006",
        "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
        "chapter_id": 2,
        "type": "mcq",
        "prompt": "Chiếu ánh sáng đơn sắc bước sóng λ = 0.5 µm từ một nguồn điểm đặt cách lỗ tròn 2 m. Sau lỗ tròn 2 m đặt một màn quan sát. Bán kính của lỗ tròn bằng bao nhiêu để tâm màn quan sát đạt độ sáng cực đại đầu tiên?",
        "options": [
            "A. 0.707 mm",
            "B. 1.000 mm",
            "C. 0.500 mm",
            "D. 1.414 mm"
        ],
        "correct_answer": "A",
        "correct_answer_text": "0.707 mm",
        "explanation": "Độ sáng tại tâm đạt cực đại đầu tiên khi lỗ tròn chứa đúng 1 đới cầu Fresnel (m = 1, đới lẻ).\nCông thức bán kính đới cầu Fresnel thứ m:\nrm = √((m * a * b * λ) / (a + b)).\nVới a = 2 m, b = 2 m, λ = 0.5 µm = 0.5 × 10⁻⁶ m, m = 1:\nr1 = √((1 * 2 * 2 * 0.5 × 10⁻⁶) / (2 + 2)) = √(2 × 10⁻⁶ / 4) = √(0.5 × 10⁻⁶) = √(5 × 10⁻⁷) ≈ 0.707 × 10⁻³ m = 0.707 mm.",
        "methodology": "Lỗ tròn: m lẻ ⇒ tâm sáng; m chẵn ⇒ tâm tối. Cực đại đầu tiên tương ứng m = 1.",
        "tips": "Bấm Casio: √( (2*2*0.5*10^-6) / 4 ) = 7.071*10^-4 m = 0.707 mm."
    })

    questions.append({
        "id": "VLDC_007",
        "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
        "chapter_id": 2,
        "type": "mcq",
        "prompt": "Một chùm tia sáng đơn sắc song song bước sóng λ = 0.5 µm chiếu vuông góc vào một khe hẹp có bề rộng b = 0.1 mm. Đặt thấu kính hội tụ tiêu cự f = 1 m ngay sau khe để thu ảnh nhiễu xạ trên màn. Bề rộng của vân cực đại giữa bằng bao nhiêu?",
        "options": [
            "A. 10 mm",
            "B. 5 mm",
            "C. 20 mm",
            "D. 2 mm"
        ],
        "correct_answer": "A",
        "correct_answer_text": "10 mm",
        "explanation": "Điều kiện cực tiểu nhiễu xạ qua 1 khe hẹp: b * sin(φ) = k * λ.\nCực đại giữa nằm giữa hai cực tiểu thứ nhất k = ±1:\nsin(φ1) ≈ φ1 = λ / b.\nVị trí của cực tiểu thứ nhất trên màn đặt tại tiêu diện thấu kính (D = f):\nx1 = f * tan(φ1) ≈ f * φ1 = (f * λ) / b.\nBề rộng của cực đại giữa bằng khoảng cách giữa hai cực tiểu bậc 1 hai bên:\nΔx0 = 2 * x1 = 2 * (f * λ) / b = 2 * (1 m * 0.5 × 10⁻⁶ m) / (0.1 × 10⁻³ m) = 10⁻⁶ / 10⁻⁴ = 10⁻² m = 10 mm.",
        "methodology": "Nhiễu xạ qua khe hẹp: Bề rộng cực đại giữa rộng gấp đôi khoảng cách giữa hai cực tiểu liên tiếp: Δx0 = 2 * (f*λ / b).",
        "tips": "Quy tắc: Cực đại giữa khe hẹp rộng GẤP ĐÔI các cực đại phụ: Δx0 = 2*f*λ/b."
    })

    questions.append({
        "id": "VLDC_008",
        "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
        "chapter_id": 2,
        "type": "mcq",
        "prompt": "Một cách tử nhiễu xạ phẳng có chu kỳ d = 2 µm. Chiếu vuông góc vào cách tử chùm sáng đơn sắc bước sóng λ = 0.5 µm. Tổng số cực đại chính quan sát được trên màn là:",
        "options": [
            "A. 9",
            "B. 8",
            "C. 7",
            "D. 4"
        ],
        "correct_answer": "A",
        "correct_answer_text": "9",
        "explanation": "Điều kiện cực đại chính của cách tử: d * sin(φ) = k * λ.\nVì |sin(φ)| ≤ 1 nên bậc cực đại thỏa mãn:\n|k| ≤ d / λ = 2 µm / 0.5 µm = 4.\nVậy k nhận các giá trị nguyên: k = 0, ±1, ±2, ±3, ±4.\nTổng số cực đại chính quan sát được là:\nN = 2 * k_max + 1 = 2 * 4 + 1 = 9 cực đại chính.",
        "methodology": "Số cực đại chính của cách tử: k_max = phần nguyên của [d/λ]. Tổng số = 2*k_max + 1.",
        "tips": "Nhớ cộng thêm 1 cho cực đại trung tâm k = 0: 2 * 4 + 1 = 9."
    })

    questions.append({
        "id": "VLDC_009",
        "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
        "chapter_id": 2,
        "type": "mcq",
        "prompt": "Hiện tượng 'Điểm sáng Arago' (Poisson spot) trong quang học sóng là hiện tượng gì?",
        "options": [
            "A. Khi chiếu sáng một đĩa tròn chắn sáng nhỏ, ở chính giữa bóng tối của đĩa trên màn quan sát xuất hiện một điểm sáng",
            "B. Khi chiếu ánh sáng qua một lỗ tròn, tâm của lỗ tròn luôn luôn sáng bất kể bán kính",
            "C. Khi chiếu ánh sáng qua lăng kính, ánh sáng bị tách thành 7 màu cầu vồng",
            "D. Khi chiếu ánh sáng vào giọt nước, tia sáng bị phản xạ toàn phần tạo thành cầu vồng"
        ],
        "correct_answer": "A",
        "correct_answer_text": "Khi chiếu sáng một đĩa tròn chắn sáng nhỏ, ở chính giữa bóng tối của đĩa trên màn quan sát xuất hiện một điểm sáng",
        "explanation": "Theo phương pháp đới cầu Fresnel, đĩa tròn chắn mất k đới cầu đầu tiên (từ đới 1 đến k).\nCác đới cầu còn lại (từ k+1 trở đi) gửi dao động đến tâm M của bóng tối. Biên độ tổng hợp tại M là:\nA = A_{k+1} / 2 > 0 (không triệt tiêu).\nVì vậy tại chính tâm của bóng hình học đĩa tròn luôn luôn có một điểm sáng. Đây là bằng chứng thực nghiệm đanh thép khẳng định bản chất sóng của ánh sáng.",
        "methodology": "Nhiễu xạ đĩa tròn: Đĩa chắn k đới đầu, biên độ tại tâm A = A_{k+1}/2 > 0 nên tâm bóng tối luôn sáng.",
        "tips": "Điểm Arago = Đĩa tròn chắn sáng nhưng tâm bóng tối lại SÁNG."
    })

    # -------------------------------------------------------------
    # CHƯƠNG 3: PHÂN CỰC ÁNH SÁNG
    # -------------------------------------------------------------
    questions.append({
        "id": "VLDC_010",
        "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
        "chapter_id": 3,
        "type": "mcq",
        "prompt": "Chiếu chùm ánh sáng tự nhiên có cường độ I_tn qua hệ thống gồm hai kính phân cực phẳng có quang trục hợp với nhau một góc α = 60°. Bỏ qua sự hấp thụ ánh sáng của bản kính. Cường độ chùm sáng sau khi đi qua hai kính bằng:",
        "options": [
            "A. 0.125 I_tn",
            "B. 0.250 I_tn",
            "C. 0.500 I_tn",
            "D. 0.0625 I_tn"
        ],
        "correct_answer": "A",
        "correct_answer_text": "0.125 I_tn",
        "explanation": "1. Khi ánh sáng tự nhiên đi qua kính phân cực thứ nhất, cường độ giảm một nửa:\nI1 = I_tn / 2.\n2. Khi chùm ánh sáng phân cực này tiếp tục đi qua kính phân tích thứ hai nghiêng góc α = 60°, theo định luật Malus:\nI2 = I1 * cos²(α) = (I_tn / 2) * cos²(60°).\nVì cos(60°) = 0.5 nên cos²(60°) = 0.25.\nDo đó: I2 = (I_tn / 2) * 0.25 = 0.125 I_tn = (1/8) I_tn.",
        "methodology": "Định luật Malus: I = I0 * cos²(α). Ánh sáng tự nhiên qua kính 1 giảm 1/2.",
        "tips": "Bấm Casio: 0.5 * cos(60)² = 0.125 = 1/8."
    })

    questions.append({
        "id": "VLDC_011",
        "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
        "chapter_id": 3,
        "type": "mcq",
        "prompt": "Tia sáng truyền từ không khí vào một bản thủy tinh có chiết suất n = √3. Để tia phản xạ là ánh sáng phân cực toàn phần thì góc tới i phải bằng bao nhiêu?",
        "options": [
            "A. 60°",
            "B. 30°",
            "C. 45°",
            "D. 53°"
        ],
        "correct_answer": "A",
        "correct_answer_text": "60°",
        "explanation": "Theo định luật Brewster, tia phản xạ là ánh sáng phân cực thẳng hoàn toàn khi góc tới i bằng góc Brewster iB thỏa mãn:\ntan(iB) = n2 / n1.\nỞ đây n1 = 1 (không khí), n2 = √3 (thủy tinh):\ntan(iB) = √3 / 1 = √3 ⇒ iB = arctan(√3) = 60°.",
        "methodology": "Định luật Brewster: tan(iB) = n2 / n1. Khi đó iB + r = 90°.",
        "tips": "Nhớ nhanh: tan(60°) = √3 ≈ 1.732; tan(45°) = 1; tan(30°) = 1/√3."
    })

    # -------------------------------------------------------------
    # CHƯƠNG 4: QUANG LƯỢNG TỬ
    # -------------------------------------------------------------
    questions.append({
        "id": "VLDC_012",
        "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
        "chapter_id": 4,
        "type": "mcq",
        "prompt": "Nhiệt độ tuyệt đối của một vật đen tuyệt đối tăng từ T1 = 1000 K lên T2 = 2000 K. Năng suất phát xạ toàn phần R của vật đó tăng lên bao nhiêu lần?",
        "options": [
            "A. 16 lần",
            "B. 4 lần",
            "C. 8 lần",
            "D. 2 lần"
        ],
        "correct_answer": "A",
        "correct_answer_text": "16 lần",
        "explanation": "Theo định luật Stefan - Boltzmann, năng suất phát xạ toàn phần của vật đen tuyệt đối tỉ lệ thuận với lũy thừa 4 của nhiệt độ tuyệt đối:\nR = σ * T⁴.\nDo đó tỉ số năng suất phát xạ khi nhiệt độ tăng từ T1 lên T2 là:\nR2 / R1 = (T2 / T1)⁴ = (2000 / 1000)⁴ = 2⁴ = 16 lần.",
        "methodology": "Định luật Stefan-Boltzmann: R ∝ T⁴. Nhiệt độ tăng k lần thì năng suất phát xạ tăng k⁴ lần.",
        "tips": "Bấm máy: 2^4 = 16 lần."
    })

    questions.append({
        "id": "VLDC_013",
        "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
        "chapter_id": 4,
        "type": "mcq",
        "prompt": "Bước sóng ứng với năng suất phát xạ cực đại của Mặt Trời là λm = 0.50 µm. Coi Mặt Trời phát xạ như vật đen tuyệt đối. Biết hằng số Wien b = 2.898 × 10⁻³ m·K. Nhiệt độ bề mặt Mặt Trời xấp xỉ bằng:",
        "options": [
            "A. 5796 K",
            "B. 6200 K",
            "C. 5400 K",
            "D. 4800 K"
        ],
        "correct_answer": "A",
        "correct_answer_text": "5796 K",
        "explanation": "Theo định luật dịch chuyển Wien:\nλm * T = b ⇒ T = b / λm.\nVới b = 2.898 × 10⁻³ m·K, λm = 0.50 µm = 0.50 × 10⁻⁶ m:\nT = (2.898 × 10⁻³) / (0.50 × 10⁻⁶) = 5796 K.",
        "methodology": "Định luật dịch chuyển Wien: T = b / λm.",
        "tips": "Bấm Casio: 2.898*10^-3 / (0.5*10^-6) = 5796 K."
    })

    questions.append({
        "id": "VLDC_014",
        "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
        "chapter_id": 4,
        "type": "mcq",
        "prompt": "Chiếu chùm bức xạ có bước sóng λ = 0.2 µm vào tấm kim loại có công thoát electron A = 3.2 eV. Cho h = 6.625 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s, 1 eV = 1.6 × 10⁻¹⁹ J. Hiệu điện thế hãm Uh để triệt tiêu dòng quang điện bằng:",
        "options": [
            "A. 3.01 V",
            "B. 4.25 V",
            "C. 1.85 V",
            "D. 6.21 V"
        ],
        "correct_answer": "A",
        "correct_answer_text": "3.01 V",
        "explanation": "Năng lượng của photon chiếu tới:\nε = (h * c) / λ = (6.625 × 10⁻³⁴ * 3 × 10⁸) / (0.2 × 10⁻⁶) = 9.9375 × 10⁻¹⁹ J.\nĐổi sang eV:\nε = (9.9375 × 10⁻¹⁹) / (1.6 × 10⁻¹⁹) ≈ 6.21 eV.\nTheo phương trình Einstein:\nε = A + e * Uh ⇒ e * Uh = ε - A = 6.21 eV - 3.2 eV = 3.01 eV.\nDo đó hiệu điện thế hãm Uh = 3.01 V.",
        "methodology": "Công thức Einstein: e*Uh = hc/λ - A. Chuyển hết sang eV để tính Uh = ε(eV) - A(eV).",
        "tips": "Mẹo siêu nhanh: ε(eV) = 1.242 / λ(µm). Với λ = 0.2 µm ⇒ ε = 1.242 / 0.2 = 6.21 eV. Uh = 6.21 - 3.2 = 3.01 V."
    })

    questions.append({
        "id": "VLDC_015",
        "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
        "chapter_id": 4,
        "type": "mcq",
        "prompt": "Trong hiện tượng tán xạ Compton, photon tới tán xạ trên electron tự do đứng yên và bay lệch đi một góc θ = 90°. Bước sóng Compton của electron là λc = 0.0243 Å. Độ tăng bước sóng Δλ của photon tán xạ bằng:",
        "options": [
            "A. 0.0243 Å",
            "B. 0.0486 Å",
            "C. 0.0121 Å",
            "D. 0.0364 Å"
        ],
        "correct_answer": "A",
        "correct_answer_text": "0.0243 Å",
        "explanation": "Công thức tính độ tăng bước sóng Compton:\nΔλ = λc * (1 - cos θ).\nVới θ = 90° ⇒ cos(90°) = 0:\nΔλ = λc * (1 - 0) = λc = 0.0243 Å = 2.43 × 10⁻¹² m.",
        "methodology": "Công thức Compton: Δλ = λc * (1 - cos θ) = 2*λc * sin²(θ/2). Khi θ = 90° thì Δλ = λc. Khi θ = 180° thì Δλ = 2*λc.",
        "tips": "Nhớ mốc góc: θ = 60° ⇒ Δλ = 0.5*λc; θ = 90° ⇒ Δλ = λc; θ = 180° ⇒ Δλ = 2*λc."
    })

    # -------------------------------------------------------------
    # CHƯƠNG 5: CƠ HỌC LƯỢNG TỬ
    # -------------------------------------------------------------
    questions.append({
        "id": "VLDC_016",
        "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
        "chapter_id": 5,
        "type": "mcq",
        "prompt": "Hạt electron không vận tốc đầu được gia tốc qua hiệu điện thế U = 100 V. Bước sóng De Broglie của electron sau khi gia tốc xấp xỉ bằng:",
        "options": [
            "A. 1.23 Å",
            "B. 0.123 Å",
            "C. 12.27 Å",
            "D. 2.45 Å"
        ],
        "correct_answer": "A",
        "correct_answer_text": "1.23 Å",
        "explanation": "Động năng của electron thu được khi gia tốc qua hiệu điện thế U:\nWđ = e * U.\nĐộng lượng: p = √(2 * m * Wđ) = √(2 * m * e * U).\nBước sóng De Broglie:\nλ = h / p = h / √(2 * m * e * U).\nCông thức tính nhanh cho electron: λ (Å) = 12.27 / √U (với U tính bằng Vôn).\nVới U = 100 V:\nλ = 12.27 / √100 = 12.27 / 10 = 1.227 Å ≈ 1.23 Å = 1.23 × 10⁻¹⁰ m.",
        "methodology": "Công thức De Broglie cho electron phi tương đối tính: λ = 12.27 / √U (Å).",
        "tips": "Mẹo Casio siêu tốc: Gõ 12.27 / √100 = 1.227 Å."
    })

    questions.append({
        "id": "VLDC_017",
        "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
        "chapter_id": 5,
        "type": "mcq",
        "prompt": "Một hạt vi mô chuyển động trong giếng thế năng một chiều sâu vô hạn có bề rộng a. Năng lượng ở trạng thái cơ bản là E1 = 2 eV. Năng lượng cần cung cấp để hạt nhảy từ trạng thái cơ bản (n = 1) lên trạng thái kích thích thứ nhất (n = 2) là:",
        "options": [
            "A. 6 eV",
            "B. 8 eV",
            "C. 4 eV",
            "D. 12 eV"
        ],
        "correct_answer": "A",
        "correct_answer_text": "6 eV",
        "explanation": "Mức năng lượng của hạt trong giếng thế 1 chiều sâu vô hạn tỉ lệ với n²:\nEn = n² * E1 (với n = 1, 2, 3...).\nTrạng thái cơ bản: n = 1 ⇒ E1 = 2 eV.\nTrạng thái kích thích thứ nhất ứng với n = 2:\nE2 = 2² * E1 = 4 * 2 eV = 8 eV.\nNăng lượng cần cung cấp để kích thích hạt là:\nΔE = E2 - E1 = 8 eV - 2 eV = 6 eV (hoặc ΔE = (2² - 1²)*E1 = 3 * 2 = 6 eV).",
        "methodology": "Mức năng lượng giếng thế: En = n² * E1. Năng lượng kích thích: ΔE = (n2² - n1²)*E1.",
        "tips": "Mẹo tính: (2² - 1²) * 2 = 3 * 2 = 6 eV."
    })

    questions.append({
        "id": "VLDC_018",
        "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
        "chapter_id": 5,
        "type": "mcq",
        "prompt": "Hạt chuyển động trong giếng thế một chiều sâu vô hạn bề rộng a ở trạng thái cơ bản (n = 1). Mật độ xác suất tìm thấy hạt đạt giá trị lớn nhất tại vị trí nào trong giếng?",
        "options": [
            "A. Chính giữa giếng (x = a / 2)",
            "B. Tại hai mép thành giếng (x = 0 và x = a)",
            "C. Mật độ xác suất bằng nhau ở mọi điểm trong giếng",
            "D. Tại x = a / 4 và x = 3a / 4"
        ],
        "correct_answer": "A",
        "correct_answer_text": "Chính giữa giếng (x = a / 2)",
        "explanation": "Hàm sóng của hạt ở trạng thái n = 1:\nψ1(x) = √(2/a) * sin(π * x / a).\nMật độ xác suất tìm hạt là:\n|ψ1(x)|² = (2/a) * sin²(π * x / a).\nHàm sin²(π*x/a) đạt giá trị cực đại bằng 1 khi:\nπ*x/a = π/2 ⇒ x = a / 2 (chính giữa giếng).\nTại hai thành giếng x = 0 và x = a, sin = 0 nên mật độ xác suất bằng 0.",
        "methodology": "Mật độ xác suất |ψn(x)|² tỉ lệ với sin²(n*π*x/a). Với n = 1, cực đại duy nhất tại x = a/2.",
        "tips": "Nắm bản chất: Ở n = 1, hạt có xu hướng tập trung nhiều nhất ở trung tâm x = a/2."
    })

    # -------------------------------------------------------------
    # CHƯƠNG 6: VẬT LÝ NGUYÊN TỬ & HẠT NHÂN
    # -------------------------------------------------------------
    questions.append({
        "id": "VLDC_019",
        "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
        "chapter_id": 6,
        "type": "mcq",
        "prompt": "Theo mẫu nguyên tử Bo của nguyên tử Hydro, electron chuyển từ quỹ đạo có mức năng lượng n = 3 về quỹ đạo n = 2 thì phát ra bức xạ thuộc dãy nào và ở vùng ánh sáng nào?",
        "options": [
            "A. Dãy Balmer, vùng ánh sáng nhìn thấy (khả kiến)",
            "B. Dãy Lyman, vùng tử ngoại",
            "C. Dãy Paschen, vùng hồng ngoại",
            "D. Dãy Brackett, vùng hồng ngoại xa"
        ],
        "correct_answer": "A",
        "correct_answer_text": "Dãy Balmer, vùng ánh sáng nhìn thấy (khả kiến)",
        "explanation": "Quy tắc các dãy quang phổ của nguyên tử Hydro:\n- Chuyển về n = 1: Dãy Lyman (vùng tử ngoại).\n- Chuyển về n = 2: Dãy Balmer (vùng ánh sáng nhìn thấy / khả kiến, vạch đỏ Hα ứng với chuyển từ 3 về 2).\n- Chuyển về n = 3: Dãy Paschen (vùng hồng ngoại).\n- Chuyển về n = 4: Dãy Brackett (hồng ngoại xa).\nVậy electron chuyển từ n = 3 về n = 2 phát ra vạch Hα thuộc dãy Balmer trong vùng ánh sáng nhìn thấy.",
        "methodology": "Ghi nhớ quy ước dãy quang phổ: Về 1 = Lyman (Tử ngoại), Về 2 = Balmer (Khả kiến), Về 3 = Paschen (Hồng ngoại).",
        "tips": "Câu thần chú: '1 Ly Tử - 2 Ban Nhìn - 3 Pát Hồng'."
    })

    questions.append({
        "id": "VLDC_020",
        "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
        "chapter_id": 6,
        "type": "mcq",
        "prompt": "Chất phóng xạ Poloni ²¹⁰Po có chu kỳ bán rã T = 138 ngày. Ban đầu có m0 = 10 g Poloni. Sau thời gian t = 414 ngày, khối lượng Poloni còn lại chưa bị phân rã là:",
        "options": [
            "A. 1.25 g",
            "B. 2.50 g",
            "C. 0.625 g",
            "D. 5.00 g"
        ],
        "correct_answer": "A",
        "correct_answer_text": "1.25 g",
        "explanation": "Số chu kỳ bán rã đã trôi qua:\nk = t / T = 414 / 138 = 3 chu kỳ.\nTheo định luật phân rã phóng xạ, khối lượng chất phóng xạ còn lại sau k chu kỳ là:\nm(t) = m0 * 2^(-k) = m0 / 2^k = 10 g / 2³ = 10 / 8 = 1.25 g.",
        "methodology": "Định luật phóng xạ: m = m0 / 2^(t/T).",
        "tips": "Bấm Casio: 10 / (2^3) = 1.25 g."
    })

    # Thêm câu hỏi điền khuyết (Numerical / Fill-in)
    questions.append({
        "id": "VLDC_021",
        "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
        "chapter_id": 1,
        "type": "fill",
        "prompt": "Trong thí nghiệm khe Young, cho khoảng cách hai khe a = 2 mm, khoảng cách đến màn D = 2 m. Chiếu ánh sáng có bước sóng λ = 0.5 µm. Tính khoảng vân giao thoa i (nhập giá trị theo đơn vị mm, chỉ điền số):",
        "options": [],
        "correct_answer": "0.5",
        "correct_answer_text": "0.5 mm",
        "explanation": "Khoảng vân giao thoa: i = (λ * D) / a = (0.5 × 10⁻⁶ m * 2 m) / (2 × 10⁻³ m) = 0.5 × 10⁻³ m = 0.5 mm.",
        "methodology": "Công thức: i = λ * D / a. Đổi tất cả về cùng đơn vị m hoặc dùng trực tiếp: i(mm) = λ(µm) * D(m) / a(mm).",
        "tips": "Mẹo tính nhẩm: i = 0.5 * 2 / 2 = 0.5 mm."
    })

    questions.append({
        "id": "VLDC_022",
        "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
        "chapter_id": 4,
        "type": "fill",
        "prompt": "Cho công thoát của kim loại Natri là A = 2.484 eV. Cho h = 6.625 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s, 1 eV = 1.6 × 10⁻¹⁹ J. Tính giới hạn quang điện λ0 của Natri (nhập giá trị theo đơn vị µm, làm tròn 2 chữ số thập phân):",
        "options": [],
        "correct_answer": "0.5",
        "correct_answer_text": "0.50 µm",
        "explanation": "Giới hạn quang điện: λ0 = (h * c) / A.\nA = 2.484 * 1.6 × 10⁻¹⁹ J ≈ 3.9744 × 10⁻¹⁹ J.\nλ0 = (6.625 × 10⁻³⁴ * 3 × 10⁸) / (3.9744 × 10⁻¹⁹) = 0.500 × 10⁻⁶ m = 0.50 µm.",
        "methodology": "Công thức: λ0 = hc / A. Mẹo: λ0 (µm) = 1.242 / A(eV).",
        "tips": "Bấm nhanh: 1.242 / 2.484 = 0.5 µm."
    })

    return questions

def main():
    print("Building VLDC Knowledge Base and Questions Database...")
    kb = build_knowledge_base()
    questions = build_questions_list()

    os.makedirs("data", exist_ok=True)
    os.makedirs("web/data", exist_ok=True)
    os.makedirs("docs/data", exist_ok=True)

    with open("data/vldc_knowledge_base.json", "w", encoding="utf-8") as f:
        json.dump(kb, f, ensure_ascii=False, indent=2)

    with open("data/vldc_questions_db.json", "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    with open("web/data/vldc_questions.json", "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    with open("docs/data/vldc_questions.json", "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    # Export JS
    js_content = f"// VLDC Questions Database (Auto-generated)\nwindow.VLDC_QUESTIONS_DATA = {json.dumps(questions, ensure_ascii=False, indent=2)};\n"
    with open("web/vldc_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    with open("docs/vldc_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)

    js_kb_content = f"// VLDC Knowledge Base (Auto-generated)\nwindow.VLDC_KNOWLEDGE_DATA = {json.dumps(kb, ensure_ascii=False, indent=2)};\n"
    with open("web/vldc_knowledge_data.js", "w", encoding="utf-8") as f:
        f.write(js_kb_content)
    with open("docs/vldc_knowledge_data.js", "w", encoding="utf-8") as f:
        f.write(js_kb_content)

    print(f"✅ Generated {len(questions)} VLDC Questions & Knowledge Base with 6 chapters successfully!")

if __name__ == "__main__":
    main()
