import json
from sync_all_databases import sync_databases

def fix():
    # 1. KTVXL PART_14_Q14
    with open('data/questions_db.json', 'r', encoding='utf-8') as f:
        ktvxl = json.load(f)
    for q in ktvxl:
        if q['id'] == 'PART_14_Q14':
            q['explanation'] = (
                "Quan sát đoạn mã trong hình: Lệnh MOVX A, @DPTR đọc dữ liệu từ RAM ngoài (địa chỉ DATA1) vào A, "
                "sau đó lệnh MOV @R1, A ghi dữ liệu từ A vào RAM nội (địa chỉ DATA2). Vòng lặp tăng cả DPTR và R1 "
                "(INC DPTR, INC R1) và tiếp tục cho đến khi gặp ký tự 24H (mã kết thúc chuỗi). "
                "Chức năng của đoạn chương trình là: Sao chép nội dung trong RAM ngoại tới RAM nội, "
                "với địa chỉ bắt đầu tương ứng đặt tại DATA1 và DATA2. Chọn đáp án B."
            )
    with open('data/questions_db.json', 'w', encoding='utf-8') as f:
        json.dump(ktvxl, f, ensure_ascii=False, indent=2)

    # 2. XSTK fixes
    with open('data/xstk_questions_db.json', 'r', encoding='utf-8') as f:
        xstk = json.load(f)

    q_map = {q['id']: q for q in xstk}

    # xstk_ch2_008
    q_map['xstk_ch2_008']['explanation'] = (
        r"Ta có $n = 100, p = 0{,}7, q = 0{,}3 \Rightarrow np = 70, \sqrt{npq} = \sqrt{100 \times 0{,}7 \times 0{,}3} = \sqrt{21} \approx 4{,}5826$." + "\n"
        r"Theo công thức tích phân Moivre-Laplace:" + "\n"
        r"$P(60 \le X \le 90) \approx \Phi_0(u_2) - \Phi_0(u_1)$" + "\n"
        r"Với $u_1 = \frac{60 - 70}{4{,}5826} \approx -2{,}18 \Rightarrow \Phi_0(-2{,}18) = -\Phi_0(2{,}18) \approx -0{,}4854$." + "\n"
        r"$u_2 = \frac{90 - 70}{4{,}5826} \approx 4{,}36 \Rightarrow \Phi_0(4{,}36) \approx 0{,}5000$." + "\n"
        r"Do đó: $P \approx 0{,}5000 - (-0{,}4854) = 0{,}9854$."
    )

    # xstk_ch2_011
    q_map['xstk_ch2_011']['explanation'] = (
        r"Để cả hai người có đúng 3 phát trúng đích (trong tổng 4 phát bắn), có 2 trường hợp xung khắc:" + "\n"
        r"- TH1: An trúng 2 phát, Bình trúng 1 phát:" + "\n"
        r"$P_1 = [C_2^2 (0{,}6)^2] \times [C_2^1 (0{,}7)^1 (0{,}3)^1] = 0{,}36 \times (2 \times 0{,}21) = 0{,}36 \times 0{,}42 = 0{,}1512$." + "\n"
        r"- TH2: An trúng 1 phát, Bình trúng 2 phát:" + "\n"
        r"$P_2 = [C_2^1 (0{,}6)^1 (0{,}4)^1] \times [C_2^2 (0{,}7)^2] = (2 \times 0{,}24) \times 0{,}49 = 0{,}48 \times 0{,}49 = 0{,}2352$." + "\n"
        r"Tổng xác suất: $P = P_1 + P_2 = 0{,}1512 + 0{,}2352 = 0{,}3864$."
    )

    # xstk_ch3_012
    q_map['xstk_ch3_012']['explanation'] = (
        r"Xác suất có đúng 2 phát trúng bia:" + "\n"
        r"$P(B) = 0{,}4(0{,}7)(0{,}65) + 0{,}4(0{,}3)(0{,}35) + 0{,}6(0{,}7)(0{,}35) = 0{,}182 + 0{,}042 + 0{,}147 = 0{,}371$." + "\n"
        r"Xác suất người thứ nhất trúng trong biến cố có đúng 2 phát trúng:" + "\n"
        r"$P(A_1 \cap B) = 0{,}4(0{,}7)(0{,}65) + 0{,}4(0{,}3)(0{,}35) = 0{,}182 + 0{,}042 = 0{,}224$." + "\n"
        r"Theo công thức xác suất có điều kiện Bayes:" + "\n"
        r"$P(A_1 | B) = \frac{P(A_1 \cap B)}{P(B)} = \frac{0{,}224}{0{,}371} = \frac{224}{371} = \frac{32}{53} \approx 0{,}6038$."
    )

    # xstk_ch3_014
    q_map['xstk_ch3_014']['explanation'] = (
        r"Xác suất có đúng 2 phát trúng đích:" + "\n"
        r"$P(B) = 0{,}7(0{,}8)(0{,}1) + 0{,}7(0{,}2)(0{,}9) + 0{,}3(0{,}8)(0{,}9) = 0{,}056 + 0{,}126 + 0{,}216 = 0{,}398$." + "\n"
        r"Xác suất người 1 trúng và có đúng 2 phát trúng:" + "\n"
        r"$P(A_1 \cap B) = 0{,}7(0{,}8)(0{,}1) + 0{,}7(0{,}2)(0{,}9) = 0{,}056 + 0{,}126 = 0{,}182$." + "\n"
        r"Theo công thức xác suất có điều kiện:" + "\n"
        r"$P(A_1 | B) = \frac{0{,}182}{0{,}398} = \frac{182}{398} = \frac{91}{199} \approx 0{,}4573$."
    )

    # xstk_ch5_016
    q_map['xstk_ch5_016']['explanation'] = (
        r"Các giá trị của $Y = X^3 - 4X^2 + 10$ tương ứng với $X$:" + "\n"
        r"- $X = 0 \Rightarrow Y = 10$, xác suất $p = 0{,}2$." + "\n"
        r"- $X = 1 \Rightarrow Y = 1 - 4 + 10 = 7$, xác suất $p = 0{,}3$." + "\n"
        r"- $X = 2 \Rightarrow Y = 8 - 16 + 10 = 2$, xác suất $p = 0{,}3$." + "\n"
        r"- $X = 3 \Rightarrow Y = 27 - 36 + 10 = 1$, xác suất $p = 0{,}2$." + "\n"
        r"Kỳ vọng:" + "\n"
        r"$E(Y) = 10(0{,}2) + 7(0{,}3) + 2(0{,}3) + 1(0{,}2) = 2{,}0 + 2{,}1 + 0{,}6 + 0{,}2 = 4{,}90$." + "\n"
        r"Kỳ vọng bình phương:" + "\n"
        r"$E(Y^2) = 100(0{,}2) + 49(0{,}3) + 4(0{,}3) + 1(0{,}2) = 20 + 14{,}7 + 1{,}2 + 0{,}2 = 36{,}10$." + "\n"
        r"Phương sai:" + "\n"
        r"$D(Y) = E(Y^2) - [E(Y)]^2 = 36{,}10 - (4{,}90)^2 = 36{,}10 - 24{,}01 = 12{,}09$."
    )

    with open('data/xstk_questions_db.json', 'w', encoding='utf-8') as f:
        json.dump(xstk, f, ensure_ascii=False, indent=2)

    print('Fixed LaTeX in JSON databases. Syncing to web and docs...')
    sync_databases()

if __name__ == '__main__':
    fix()
