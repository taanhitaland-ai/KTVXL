"""Reviewed physics metadata and formulas; do not infer or change answer keys."""
import re

CHAPTER_NAMES = {
    1: 'Dao động & Sóng điện từ', 2: 'Quang học sóng',
    3: 'Quang học lượng tử', 4: 'Cơ học lượng tử',
    5: 'Vật lý nguyên tử', 6: 'Vật lý hạt nhân'
}

CORE_FORMULAS = {
    'Hiệu quang lộ khe Young': r'$\Delta L=L_2-L_1=\frac{ax}{D}$',
    'Vị trí vân sáng & vân tối': r'Vân sáng: $x_s=\frac{k\lambda D}{a}$; Vân tối: $x_t=\frac{(k+0.5)\lambda D}{a}$',
    'Khoảng vân giao thoa': r'$i=\frac{\lambda D}{a}$',
    'Độ dịch vân khi đặt bản mỏng': r'$\Delta x=\frac{D(n-1)e}{a}$',
    'Độ dịch vân khi dịch chuyển nguồn S': r'$|\Delta x|=\frac{D|y_0|}{d}$',
    'Giao thoa nêm không khí': r'Khoảng vân: $i=\frac{\lambda}{2\alpha}$; Vân tối: $d_k=\frac{k\lambda}{2}$',
    'Vân tròn Newton (ánh sáng phản xạ)': r'Vân tối: $r_k=\sqrt{kR\lambda}$; Vân sáng: $r_k=\sqrt{(k-0.5)R\lambda}$',
    'Bán kính đới cầu Fresnel thứ k': r'$r_k=\sqrt{\frac{kab\lambda}{a+b}}$',
    'Diện tích đới cầu Fresnel': r'$\Delta S\approx\frac{\pi ab\lambda}{a+b}$',
    'Nhiễu xạ qua lỗ tròn': r'$m=\frac{R_0^2(a+b)}{ab\lambda}$',
    'Nhiễu xạ sóng phẳng qua 1 khe hẹp (Fraunhofer)': r'Cực tiểu: $b\sin\varphi=k\lambda$; Cực đại phụ (xấp xỉ): $b\sin\varphi\approx\frac{(2k+1)\lambda}{2}$',
    'Cách tử nhiễu xạ (Diffraction Grating)': r'$d\sin\varphi=k\lambda$, với $d=a+b$ là chu kỳ cách tử',
    'Định luật Malus (Maluyt)': r'$I=I_0\cos^2\alpha$',
    'Định luật Brewster': r'$\tan i_B=\frac{n_2}{n_1}=n_{21}$',
    'Ánh sáng tự nhiên qua kính phân cực lý tưởng': r'$I_1=\frac{I_{\mathrm{tn}}}{2}$',
    'Hệ 2 kính phân cực quay góc α': r'$I=\frac{I_{\mathrm{tn}}}{2}\cos^2\alpha$',
    'Định luật Stefan-Boltzmann': r'$R=\sigma T^4$',
    'Định luật dịch chuyển Wien': r'$\lambda_m T=b$',
    'Năng lượng & động lượng Photon': r'$\varepsilon=h\nu=\frac{hc}{\lambda}$; $p=\frac h\lambda=\frac\varepsilon c$',
    'Phương trình Einstein quang điện ngoài': r'$h\nu=A+\frac12mv_{0\max}^2=A+eU_h$',
    'Tán xạ Compton': r"$\Delta\lambda=\lambda'-\lambda=2\lambda_c\sin^2\frac\theta2=\lambda_c(1-\cos\theta)$",
    'Động năng electron giật lùi (Compton)': r"$K_e=hc\left(\frac1\lambda-\frac1{\lambda'}\right)$",
    'Bước sóng De Broglie': r'$\lambda=\frac hp=\frac h{mv}=\frac h{\sqrt{2mW_{\mathrm{d}}}}$',
    'Hệ thức bất định Heisenberg': r'$\Delta x\,\Delta p_x\ge\frac\hbar2$; $\Delta E\,\Delta t\ge\frac\hbar2$',
    'Giếng thế năng 1 chiều sâu vô hạn': r'$E_n=\frac{n^2\pi^2\hbar^2}{2ma^2}=\frac{n^2h^2}{8ma^2}$',
    'Hàm sóng trong giếng thế 1 chiều': r'$\psi_n(x)=\sqrt{\frac2a}\sin\frac{n\pi x}{a}$',
    'Xác suất tìm hạt': r'$dw=|\psi(x)|^2dx$; $w=\int|\psi(x)|^2dx$',
    'Mức năng lượng nguyên tử Hydro (Mẫu Bo)': r'$E_n=-\frac{13.6}{n^2}\,\mathrm{eV}$',
    'Công thức Rydberg cho quang phổ Hydro': r'$\frac1\lambda=R_H\left(\frac1{m^2}-\frac1{n^2}\right)$',
    'Độ hụt khối & Năng lượng liên kết': r'$\Delta m=Z m_p+(A-Z)m_n-m_X$; $E_{\mathrm{lk}}=\Delta m c^2$',
    'Định luật phóng xạ': r'$N(t)=N_0 e^{-\lambda t}=N_0\,2^{-t/T}$',
}

# Existing source notes use these alternate titles for the same formulas.
for original, canonical in {
    'Định luật Stefan - Boltzmann': 'Định luật Stefan-Boltzmann',
    'Năng lượng photon & Động lượng photon': 'Năng lượng & động lượng Photon',
    'Phương trình quang điện Einstein': 'Phương trình Einstein quang điện ngoài',
    'Độ tăng bước sóng Compton': 'Tán xạ Compton',
    'Động năng electron giật lùi trong Compton': 'Động năng electron giật lùi (Compton)',
    'Hạt trong giếng thế 1 chiều sâu vô hạn (bề rộng a)': 'Giếng thế năng 1 chiều sâu vô hạn',
    'Hàm sóng dừng trong giếng thế': 'Hàm sóng trong giếng thế 1 chiều',
    'Bước sóng quang phổ Hydro': 'Công thức Rydberg cho quang phổ Hydro',
    'Độ hụt khối & Năng lượng liên kết hạt nhân': 'Độ hụt khối & Năng lượng liên kết',
    'Định luật phân rã phóng xạ': 'Định luật phóng xạ',
}.items():
    CORE_FORMULAS[original] = CORE_FORMULAS[canonical]

TIPS = {
    'vldc_ch1_008': r'Bấm Casio: $\sqrt{4\times10\times0.5\times10^{-6}}=4.47\times10^{-3}\,\mathrm{m}=4.47\,\mathrm{mm}$.',
    'vldc_ch2_037': r'Bấm Casio: $\sqrt{\frac{2\times2\times0.5\times10^{-6}}4}=7.071\times10^{-4}\,\mathrm{m}=0.707\,\mathrm{mm}$.',
    'vldc_ch4_012': r'Bấm máy: $2^4=16$ lần.',
    'vldc_ch4_013': r'Bấm Casio: $\frac{2.898\times10^{-3}}{0.5\times10^{-6}}=5796\,\mathrm{K}$.',
    'vldc_ch6_006': r'Bấm Casio: $\frac{10}{2^3}=1.25\,\mathrm{g}$.',
    'vldc_ch2_041': r'Bấm Casio: $\sqrt{4\times1\times0.5\times10^{-6}}=1.414\times10^{-3}\,\mathrm{m}=1.414\,\mathrm{mm}$.',
    'vldc_ch4_020': r'Bấm Casio: $\frac{2\times0.4\times10^{-6}}{6.625\times10^{-34}\times3\times10^8}=4.025\times10^{18}$.',
    'vldc_ch4_021': r'Bấm Casio: $\sqrt{\frac{2\times1.79\times1.6\times10^{-19}}{9.109\times10^{-31}}}=7.93\times10^5\,\mathrm{m/s}$.',
    'vldc_ch6_012': r'Bấm Casio: $\frac{1000}{2^3}=125\,\mathrm{Bq}$.',
}


def normalize_physics_metadata(questions):
    for q in questions:
        if q.get('source') == 'VLDC_STANDARD':
            legacy = re.match(r'vldc_ch([1-6])_', q['id'])
            if legacy:
                chapter = {1: 2, 2: 2, 3: 2, 4: 3, 5: 4, 6: 6}[int(legacy[1])]
                if q['id'] in ('vldc_ch6_005', 'vldc_ch6_007', 'vldc_ch6_009', 'vldc_ch6_010'):
                    chapter = 5
                q['chapter_id'] = chapter
                q['chapter'] = CHAPTER_NAMES[chapter]
                q['chapter_title'] = f'Chương {chapter}: {CHAPTER_NAMES[chapter]}'
        if q['id'] in TIPS:
            q['tips'] = TIPS[q['id']]
    return questions


def normalize_physics_knowledge(knowledge):
    for chapter in knowledge['chapters']:
        for formula in chapter.get('core_formulas', []):
            if formula['name'] in CORE_FORMULAS:
                formula['formula'] = CORE_FORMULAS[formula['name']]
    # The old notes used a different six-chapter numbering from the questions.
    if knowledge.get('chapter_scheme') != 'KMA_A2':
        old = knowledge['chapters']
        optics = {**old[0], 'id': 2, 'title': 'Chương 2: Quang học sóng',
                  'summary': 'Giao thoa, nhiễu xạ và phân cực ánh sáng.',
                  'core_formulas': sum([c.get('core_formulas', []) for c in old[:3]], []),
                  'magic_keywords': sum([c.get('magic_keywords', []) for c in old[:3]], [])}
        em = {'id': 1, 'title': 'Chương 1: Dao động & Sóng điện từ',
              'summary': 'Các hệ thức dùng trong câu hỏi dao động LC và sóng điện từ.',
              'core_formulas': [
                  {'name': 'Dao động điện tích khi q(0) = Q₀', 'formula': r'$q=Q_0\cos\omega t$', 'desc': 'Điều kiện ban đầu như câu Đề Test Cuối về mạch LC.'},
                  {'name': 'Chu kỳ năng lượng trong mạch LC', 'formula': r'$T_{\mathrm{nang\ luong}}=\frac T2$', 'desc': 'Năng lượng phụ thuộc bình phương điện tích hoặc dòng điện.'},
                  {'name': 'Bảo toàn năng lượng LC', 'formula': r'$I_0=U_0\sqrt{\frac CL}$; $\Phi=\frac{L I_0}{N}$', 'desc': 'N là số vòng dây; Φ là từ thông qua mỗi vòng.'},
                  {'name': 'Dao động tắt dần', 'formula': r'$Q(t)=Q_0e^{-\beta t}$; $\beta=\frac R{2L}$', 'desc': 'Biên độ giảm theo hàm mũ.'},
                  {'name': 'Bước sóng điện từ trong chân không', 'formula': r'$\lambda=\frac cf=cT$', 'desc': 'c là vận tốc ánh sáng trong chân không.'}
              ]}
        atom = {**old[5], 'id': 5, 'title': 'Chương 5: Vật lý nguyên tử',
                'summary': 'Mẫu Bo và các dãy quang phổ nguyên tử Hydro.',
                'core_formulas': old[5]['core_formulas'][:2], 'magic_keywords': []}
        nuclear = {**old[5], 'id': 6, 'title': 'Chương 6: Vật lý hạt nhân',
                   'summary': 'Độ hụt khối, năng lượng liên kết và phóng xạ.',
                   'core_formulas': old[5]['core_formulas'][2:]}
        knowledge['chapters'] = [em, optics, {**old[3], 'id': 3, 'title': 'Chương 3: Quang học lượng tử'},
                                 {**old[4], 'id': 4, 'title': 'Chương 4: Cơ học lượng tử'}, atom, nuclear]
        knowledge['chapter_scheme'] = 'KMA_A2'
    return knowledge
