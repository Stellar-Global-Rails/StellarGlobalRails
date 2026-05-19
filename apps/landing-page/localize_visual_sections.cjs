const fs = require('fs');
const path = require('path');

const uiPath = path.join(__dirname, 'src', 'i18n', 'ui.ts');
let content = fs.readFileSync(uiPath, 'utf8');

const translations = {
  'zh': {
    // Hero
    'hero.title': '新一代 B2B 经济。',
    'hero.subtitle.ceo': '在单一集成平台中实现资产代币化、合同自动化和全球支付结算。',
    'hero.subtitle.dev': 'TypeScript/Python SDK、实时 Webhooks 和原生端点 —— 构建具有 3 秒结算能力的 dApps。',
    'hero.cta': '探索产品',
    'hero.live_status': '运行中: Stellar 主网',
    'hero.modules_count': '集成功能',
    'hero.products_count': '核心产品',
    'hero.rail': 'Stellar Global Rails.',
    'hero.rail.ceo': '全球金融轨道。',
    'hero.rail.dev': '全球可组合 API。',
    'hero.scroll': '滚动',
    'hero.settlement': '结算',
    'hero.version': '2026 基础设施套件',

    // Platform
    'platform.title': '它不是一个产品。',
    'platform.subtitle': '它是一个基础设施。',
    'platform.desc': '传统的金融体系是为那些已经拥有银行、商业登记和固定地址的人建立的。Stellar Global Rails 是一个新层 —— 一个任何资金流都可以运行的轨道。',
    'platform.feature1.title': '即时结算',
    'platform.feature1.desc': '3 到 5 秒。无需 D+2，无需排队。',
    'platform.feature2.title': '默认全球化',
    'platform.feature2.desc': 'USDC、BRZ 和本地稳定币。',
    'platform.feature3.title': '可验证且可审计',
    'platform.feature3.desc': '每笔交易均记录在链上。',
    'platform.audit_active': '主动审计',
    'platform.settlement_done': '结算完成',
    'fv.core.title': 'Stellar Core',
    'fv.core.desc': '全球连接的基础设施，活跃且运行稳定。',
    'fv.core.status': '协议活跃',

    // Status (The problem with old rails)
    'status.title': '旧轨道的局限性',
    'status.desc': '上个世纪设计的金融体系已无法满足当今世界对速度、规模和可访问性的要求。',
    'status.traditional': '传统系统',
    'status.rails': 'Stellar Global Rails',
    'status.bad1.title': '结算周期长 (D+2, D+30)',
    'status.bad1.desc': '流程滞后，企业融资成本高昂。',
    'status.bad2.title': '全球交易成本极高',
    'status.bad2.desc': 'SWIFT、汇率差价、代理行费用。',
    'status.bad3.title': '准入门槛严苛',
    'status.bad3.desc': '需要正式银行账户、商业登记和完美的信用历史。',
    'status.bad4.title': '缺乏互操作性',
    'status.bad4.desc': '银行各自为政。不兼容的系统需要中间件。',
    'status.good1.title': '秒级结算',
    'status.good1.desc': '支付即完成，不可逆转，资金立即到账。',
    'status.good2.title': '极低成本',
    'status.good2.desc': '成本极低且可预测，支持真实的微支付。',
    'status.good3.title': '包容性 (无需银行账户)',
    'status.good3.desc': '通过非托管钱包和本地锚点实现民主化访问。',
    'status.good4.title': '开放标准 (链上)',
    'status.good4.desc': '开放协议。公开透明，实时可审计。',

    // Three Pillars (whysgr)
    'whysgr.title': '基础设施的三大支柱',
    'whysgr.subtitle': '任何全球金融应用的坚实基础。',
    'whysgr.p1.title': '身份',
    'whysgr.p1.desc': '交易主体。SocialPay 解决了信任层、KYC 和数字身份识别问题。',
    'whysgr.p2.title': '规则',
    'whysgr.p2.desc': '交易方式。ContractEase 通过 AI 实现协议、管辖权和合规性的自动化。',
    'whysgr.p3.title': '执行',
    'whysgr.p3.desc': '结算场所。Kivo Pay 确保价值移动、Pix 和实时转换。',
  },
  'ko': {
    // Hero
    'hero.title': '차세대 B2B 경제.',
    'hero.subtitle.ceo': '단일 통합 플랫폼에서 자산 토큰화, 계약 자동화 및 글로벌 결제 정산을 실현하세요.',
    'hero.subtitle.dev': 'TypeScript/Python SDK, 실시간 웹훅 및 기본 엔드포인트 —— 3초 정산 능력을 갖춘 dApp을 구축하세요.',
    'hero.cta': '제품 탐색',
    'hero.live_status': '라이브: Stellar 메인넷',
    'hero.modules_count': '통합 기능',
    'hero.products_count': '핵심 제품',
    'hero.rail': 'Stellar Global Rails.',
    'hero.rail.ceo': '글로벌 금융 레일.',
    'hero.rail.dev': '글로벌 컴포저블 API.',
    'hero.scroll': '스크롤',
    'hero.settlement': '정산',
    'hero.version': '2026 인프라 수트',

    // Platform
    'platform.title': '이것은 제품이 아닙니다.',
    'platform.subtitle': '이것은 인프라입니다.',
    'platform.desc': '전통적인 금융 시스템은 이미 은행, 사업자 등록 및 고정 주소를 가진 사람들을 위해 구축되었습니다. Stellar Global Rails는 새로운 레이어 —— 모든 자금 흐름이 실행될 수 있는 레일입니다.',
    'platform.feature1.title': '즉시 정산',
    'platform.feature1.desc': '3~5초. D+2 없음, 대기열 없음.',
    'platform.feature2.title': '기본 글로벌화',
    'platform.feature2.desc': 'USDC, BRZ 및 현지 스테이블코인.',
    'platform.feature3.title': '검증 및 감사 가능',
    'platform.feature3.desc': '모든 거래가 온체인에 기록됩니다.',
    'platform.audit_active': '능동적 감사',
    'platform.settlement_done': '정산 완료',
    'fv.core.title': 'Stellar Core',
    'fv.core.desc': '글로벌로 연결된 인프라, 활성 상태이며 안정적으로 작동합니다.',
    'fv.core.status': '프로토콜 활성',

    // Status
    'status.title': '오래된 레일의 문제점',
    'status.desc': '지난 세기에 설계된 금융 시스템은 오늘날의 세계가 요구하는 속도, 규모 및 접근성을 충족하지 못합니다.',
    'status.traditional': '전통적 시스템',
    'status.rails': 'Stellar Global Rails',
    'status.bad1.title': '긴 정산 주기 (D+2, D+30)',
    'status.bad1.desc': '프로세스 지연으로 인한 기업의 높은 금융 비용.',
    'status.bad2.title': '매우 높은 글로벌 거래 비용',
    'status.bad2.desc': 'SWIFT, 환율 스프레드, 중개 은행 수수료.',
    'status.bad3.title': '엄격한 진입 장벽',
    'status.bad3.desc': '정식 은행 계좌, 사업자 등록 및 완벽한 신용 기록 요구.',
    'status.bad4.title': '상호 운용성 부족',
    'status.bad4.desc': '고립된 은행들. 미들웨어가 필요한 호환되지 않는 시스템.',
    'status.good1.title': '초단위 정산',
    'status.good1.desc': '결제 즉시 완료, 취소 불가능, 자금 즉시 도착.',
    'status.good2.title': '초저비용',
    'status.good2.desc': '예측 가능하고 미미한 비용으로 실제 미세 결제 가능.',
    'status.good3.title': '포용성 (은행 계좌 불필요)',
    'status.good3.desc': '비수탁형 지갑과 현지 앵커를 통한 민주적 접근.',
    'status.good4.title': '개방형 표준 (온체인)',
    'status.good4.desc': '오픈 프로토콜. 공개적 투명성 및 실시간 감사 가능.',

    // Three Pillars (whysgr)
    'whysgr.title': '인프라의 3대 지주',
    'whysgr.subtitle': '모든 글로벌 금융 애플리케이션을 위한 견고한 기반.',
    'whysgr.p1.title': '신원',
    'whysgr.p1.desc': '거래 주체. SocialPay는 신뢰 레이어, KYC 및 디지털 신원 확인 문제를 해결합니다.',
    'whysgr.p2.title': '규칙',
    'whysgr.p2.desc': '거래 방식. ContractEase는 AI를 통해 합의, 관할권 및 규제 준수를 자동화합니다.',
    'whysgr.p3.title': '실행',
    'whysgr.p3.desc': '정산 장소. Kivo Pay는 가치 이동, Pix 및 실시간 변환을 보장합니다.',
  },
  'ar': {
    // Hero
    'hero.title': 'اقتصاد B2B الجديد.',
    'hero.subtitle.ceo': 'ترميز الأصول، وأتمتة العقود، وتسوية المدفوعات العالمية في منصة واحدة متكاملة.',
    'hero.subtitle.dev': 'TypeScript/Python SDK، وخطافات ويب في الوقت الفعلي، ونقاط نهاية أصلية - ابنِ تطبيقات dApps مع تسوية في 3 ثوانٍ.',
    'hero.cta': 'استكشاف المنتجات',
    'hero.live_status': 'مباشر: Stellar Mainnet',
    'hero.modules_count': 'الميزات المتكاملة',
    'hero.products_count': 'المنتجات الأساسية',
    'hero.rail': 'Stellar Global Rails.',
    'hero.rail.ceo': 'قضبان مالية عالمية.',
    'hero.rail.dev': 'واجهة برمجة تطبيقات قابلة للتركيب عالمياً.',
    'hero.scroll': 'تمرير',
    'hero.settlement': 'تسوية',
    'hero.version': 'مجموعة البنية التحتية 2026',

    // Platform
    'platform.title': 'هذا ليس منتجاً.',
    'platform.subtitle': 'إنها بنية تحتية.',
    'platform.desc': 'بُني النظام المالي التقليدي لمن يملكون بالفعل بنوكاً وسجلاً تجارياً وعنواناً ثابتاً. Stellar Global Rails هي طبقة جديدة - قضبان يمكن لأي تدفق مالي الجري عليها.',
    'platform.feature1.title': 'تسوية فورية',
    'platform.feature1.desc': 'من 3 إلى 5 ثوانٍ. لا انتظار D+2، لا طوابير.',
    'platform.feature2.title': 'عالمي افتراضياً',
    'platform.feature2.desc': 'USDC و BRZ والعملات المستقرة المحلية.',
    'platform.feature3.title': 'قابل للتحقق والتدقيق',
    'platform.feature3.desc': 'كل معاملة مسجلة على السلسلة.',
    'platform.audit_active': 'تدقيق نشط',
    'platform.settlement_done': 'تمت التسوية',
    'fv.core.title': 'Stellar Core',
    'fv.core.desc': 'بنية تحتية عالمية متصلة ونشطة وتعمل باستقرار تام.',
    'fv.core.status': 'البروتوكول نشط',

    // Status
    'status.title': 'مشكلة القضبان القديمة',
    'status.desc': 'الأنظمة المالية المصممة في القرن الماضي لا تلبي السرعة والنطاق وسهولة الوصول التي يتطلبها عالم اليوم.',
    'status.traditional': 'النظام التقليدي',
    'status.rails': 'Stellar Global Rails',
    'status.bad1.title': 'أيام للتسوية (D+2, D+30)',
    'status.bad1.desc': 'تدفقات معطلة، وشركات تمول رأس مال عامل باهظ الثمن.',
    'status.bad2.title': 'تكاليف باهظة في المعاملات العالمية',
    'status.bad2.desc': 'SWIFT، وفروق أسعار الصرف، ورسوم البنوك المراسلة.',
    'status.bad3.title': 'عوائق دخول صارمة',
    'status.bad3.desc': 'تطلب حسابات بنكية رسمية وسجلاً تجارياً وتاريخاً ائتمانياً مثالياً.',
    'status.bad4.title': 'نقص التوافق التشغيلي',
    'status.bad4.desc': 'بنوك معزولة. أنظمة غير متوافقة تتطلب برامج وسيطة.',
    'status.good1.title': 'تسوية في ثوانٍ',
    'status.good1.desc': 'دفع نهائي وغير قابل للإلغاء ويصل رأس المال فوراً.',
    'status.good2.title': 'أجزاء من السنت',
    'status.good2.desc': 'تكاليف متوقعة وضئيلة، مما يسمح بمدفوعات دقيقة حقيقية.',
    'status.good3.title': 'شامل (لا يتطلب حساباً بنكياً)',
    'status.good3.desc': 'وصول ديمقراطي عبر محافظ غير احتجازية ومثبتات محلية.',
    'status.good4.title': 'معيار مفتوح (على السلسلة)',
    'status.good4.desc': 'بروتوكولات مفتوحة. شفافية عامة وقابلية للتدقيق في الوقت الفعلي.',

    // Three Pillars (whysgr)
    'whysgr.title': 'الركائز الثلاث للبنية التحتية',
    'whysgr.subtitle': 'الأساس المتين لأي تطبيق مالي عالمي.',
    'whysgr.p1.title': 'الهوية',
    'whysgr.p1.desc': 'من يقوم بالمعاملة. SocialPay يحل طبقة الثقة و KYC والتعريف الرقمي.',
    'whysgr.p2.title': 'القواعد',
    'whysgr.p2.desc': 'كيف تتم المعاملة. ContractEase يؤتمت الاتفاقيات والولاية القضائية والامتثال عبر الذكاء الاصطناعي.',
    'whysgr.p3.title': 'التنفيذ',
    'whysgr.p3.desc': 'أين تتم التسوية. Kivo Pay يضمن حركة القيمة و Pix والتحويل في الوقت الفعلي.',
  }
};

const ptLines = content.match(/'pt-br':\s*{([\s\S]*?)},/);
const ptData = {};
if (ptLines) {
    const lines = ptLines[1].split('\n');
    lines.forEach(line => {
        const match = line.match(/'([^']+)':\s*'([^']*)',/);
        if (match) ptData[match[1]] = match[2];
    });
}

function rebuildBlocks() {
  const languages = ['zh', 'ko', 'ar'];
  for (const lang of languages) {
    const langBlockRegex = new RegExp(`'${lang}':\\s*{[\\s\\S]*?},(\\s*'[a-z\\-]+':|\\s*}\\s*;|\\s*}\\s*$)`, 'm');
    const match = content.match(langBlockRegex);
    
    if (match) {
        let blockText = `'${lang}': {\n`;
        const translatedKeys = translations[lang];
        
        // Read current keys from the block to preserve what's already there
        const currentData = {};
        const blockContent = match[0].match(/{([\s\S]*?)}/)[1];
        blockContent.split('\n').forEach(line => {
            const m = line.match(/'([^']+)':\s*'([^']*)',/);
            if (m) currentData[m[1]] = m[2];
        });

        Object.keys(ptData).forEach(key => {
            // Update only the keys specified in the translations map, preserve others
            let value = translatedKeys[key] || currentData[key] || ptData[key];
            blockText += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
        });
        
        blockText += '  },';
        content = content.replace(match[0], blockText + match[1]);
    }
  }
}

rebuildBlocks();
fs.writeFileSync(uiPath, content);
console.log('Hero, Platform, Status, and Pillars sections localized for zh, ko, ar!');
