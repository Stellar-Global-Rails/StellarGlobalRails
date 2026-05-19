const fs = require('fs');
const path = require('path');

const uiPath = path.join(__dirname, 'src', 'i18n', 'ui.ts');
let content = fs.readFileSync(uiPath, 'utf8');

const baseTranslations = {
  'zh': {
    'builders.badge': '为开发者而建',
    'builders.title.part1': '由真正懂的人',
    'builders.title.part2': '所造。',
    'hero.cta': '探索产品',
    'hero.title': 'B2B 新经济。',
    'hero.rail': 'Stellar Global Rails.',
    'hero.rail.ceo': '全球金融轨道。',
    'hero.rail.dev': '全球可组合 API。',
    'hero.subtitle.ceo': '在单一集成平台上将资产代币化、自动化合同和结算全球支付。',
    'hero.subtitle.dev': 'TypeScript/Python SDK、实时 Webhook 和原生端点。',
    'howitworks.title': '轨道工程',
    'howitworks.subtitle': '我们如何在遗留系统和链上流动性之间建立一座无形的桥梁。',
    'howitworks.sysarch': '系统架构',
    'howitworks.step1.title': '入站 (Onboarding)',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step3.title': '套件（产品）',
    'howitworks.step4.title': '出站 (Payout)',
    'howitworks.step1.tech': 'ONBOARDING_PIX',
    'howitworks.step2.tech': 'SOROBAN_CONTRACT',
    'howitworks.step3.tech': 'ORCHESTRATION_CORE',
    'howitworks.step4.tech': 'OFF_RAMP_PAYOUT',
    'platform.title': '不是产品。',
    'platform.subtitle': '它是基础设施。',
    'platform.desc': '传统金融体系是为那些已经拥有银行、税务 ID 和固定地址的人设计的。Stellar Global Rails 是一个新层 —— 一个任何金融流都可以运行的轨道。',
    'suite.title': '产品套件。',
    'suite.ai_agents': 'AI 代理',
    'suite.product': '产品',
    'suite.explore_product': '探索产品',
    'reach.title.part1': '为世界而造。',
    'reach.title.part2': ' 源自巴西。',
    'nav.products': '产品',
    'nav.docs': '文档',
    'nav.how_it_works': '运作方式',
    'nav.investors': '致投资者',
    'nav.platform': '平台',
    'profile.business': '业务',
    'profile.developer': '开发',
    
    // SocialPay
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': '让经济拥有人性化的面孔。',
    'suite.socialpay.tagline': '让经济拥有人性化的面孔。',
    'suite.socialpay.desc': 'Web3 生态系统的人性化入口。可验证的数字身份、通过 @handle 进行的交易以及解决区块链复杂性的可审计馈送。',
    
    // ContractEase
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': '让协议变得不可篡改且智能化。',
    'suite.contractease.tagline': '让协议变得不可篡改且智能化。',
    'suite.contractease.desc': '带有司法 AI 的智能 B2B 合同管理。从草案到不可篡改的签名，按司法管辖区进行合规验证。',
    
    // Kivo Pay
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': '让资金以光速移动。',
    'suite.kivopay.tagline': '让资金以光速移动。',
    'suite.kivopay.desc': '人和机器的结算引擎。通过 Pix 和稳定币进行支付 (H2M)，并通过 IoT 的 x402 协议进行自主微支付 (M2M)。',

    // Kivo Pay Agents
    'product.kivopay.agent.settlement.title': '智能结算代理 (H2M)',
    'product.kivopay.agent.settlement.desc': 'AI 充当结算雷达，在 Pix、卡和稳定币之间选择最便宜、最快的路径。',
    'product.kivopay.agent.autonomous.title': '自主代理 (M2M)',
    'product.kivopay.agent.autonomous.desc': '嵌入 IoT 设备中的 AI，无需人工干预即可协商能源价格或微交易。',
    'product.kivopay.agent.compliance.title': '金融合规代理',
    'product.kivopay.agent.compliance.desc': '实时监控交易以检测洗钱并确保符合监管要求。',
    'product.kivopay.agent.fraud-predictor.title': '欺诈预测先知',
    'product.kivopay.agent.fraud-predictor.desc': '用于零日欺诈预测的神经引擎。分析生物识别向量和设备指纹。',
    
    // Kivo Pay Features
    'product.kivopay.feature.cross-border.name': '跨境汇款',
    'product.kivopay.feature.cross-border.desc': '即时国际发送，费用降低高达 90%。USDC 转出，BRL 通过 Pix 到账。',
    'product.kivopay.feature.mass-disbursements.name': '批量支付',
    'product.kivopay.feature.mass-disbursements.desc': '一键向数百名收款人付款。CSV 上传、USDC 存款和原子执行。',
    'product.kivopay.feature.social-fundraising.name': '社会筹款',
    'product.kivopay.feature.social-fundraising.desc': '透明且可审计的众筹。接收来自世界各地的 USDC/BRZ 捐款。',
    'product.kivopay.feature.m2m-payments.name': 'M2M 自主支付',
    'product.kivopay.feature.m2m-payments.desc': '通过 Stellar x402 协议进行的微交易，无需人工干预。',
    'product.kivopay.feature.kivo-terminal.name': 'Kivo 终端 (POS)',
    'product.kivopay.feature.kivo-terminal.desc': '用于离线支付的专用硬件。在坚固的终端中接受 Pix、卡和稳定币。',
  },
  'ko': {
    'builders.badge': '개발자를 위해',
    'builders.title.part1': '진정으로 이해하는 이들이',
    'builders.title.part2': '만들었습니다.',
    'hero.cta': '제품 살펴보기',
    'hero.title': '새로운 B2B 경제.',
    'hero.rail': 'Stellar Global Rails.',
    'hero.rail.ceo': '글로벌 금융 레일.',
    'hero.rail.dev': '글로벌 조합 가능 API.',
    'hero.subtitle.ceo': '단일 통합 플랫폼에서 자산 토큰화, 계약 자동화 및 글로벌 결제 정산.',
    'hero.subtitle.dev': 'TypeScript/Python SDK, 실시간 웹훅 및 네이티브 엔드포인트.',
    'howitworks.title': '레일 엔지니어링',
    'howitworks.subtitle': '기존 시스템과 온체인 유동성 사이에 보이지 않는 가교를 놓는 방법.',
    'howitworks.sysarch': '시스템 아키텍처',
    'howitworks.step1.title': '온보딩 (Onboarding)',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step3.title': '수트 (제품)',
    'howitworks.step4.title': '지급 (Payout)',
    'howitworks.step1.tech': 'ONBOARDING_PIX',
    'howitworks.step2.tech': 'SOROBAN_CONTRACT',
    'howitworks.step3.tech': 'ORCHESTRATION_CORE',
    'howitworks.step4.tech': 'OFF_RAMP_PAYOUT',
    'platform.title': '제품이 아닙니다.',
    'platform.subtitle': '인프라입니다.',
    'platform.desc': '전통적인 금융 시스템은 이미 은행, 세금 ID, 고정 주소가 있는 사람들을 위해 구축되었습니다. Stellar Global Rails는 새로운 레이어, 즉 모든 금융 흐름이 실행될 수 있는 레일입니다.',
    'suite.title': '제품 수트.',
    'suite.ai_agents': 'AI 에이전트',
    'suite.product': '제품',
    'suite.explore_product': '제품 탐색',
    'reach.title.part1': '세상을 위해.',
    'reach.title.part2': ' 브라질에서 탄생.',
    'nav.products': '제품',
    'nav.docs': '문서',
    'nav.how_it_works': '작동 원리',
    'nav.investors': '투자자 정보',
    'nav.platform': '플랫폼',
    'profile.business': '비즈니스',
    'profile.developer': '개발자',
    
    // SocialPay
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': '경제가 인간의 얼굴을 갖는 곳.',
    'suite.socialpay.tagline': '경제가 인간의 얼굴을 갖는 곳.',
    'suite.socialpay.desc': 'Web3 생태계로의 인간적인 관문. 검증 가능한 디지털 신원, @handle을 통한 거래 및 블록체인 복잡성을 해결하는 감사 가능한 피드.',
    
    // ContractEase
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': '계약이 불변하고 스마트해지는 곳.',
    'suite.contractease.tagline': '계약이 불변하고 스마트해지는 곳.',
    'suite.contractease.desc': '법률 AI가 포함된 스마트 B2B 계약 관리. 초안부터 불변의 서명까지, 관할권별 규제 준수 검증.',
    
    // Kivo Pay
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': '돈이 빛의 속도로 이동하는 곳.',
    'suite.kivopay.tagline': '돈이 빛의 속도로 이동하는 곳.',
    'suite.kivopay.desc': '인간과 기계를 위한 결제 엔진. Pix 및 스테이블코인을 통한 결제(H2M)와 IoT용 x402 프로토콜을 통한 자율 미세 결제(M2M).',

    // Kivo Pay Agents
    'product.kivopay.agent.settlement.title': '지능형 결제 에이전트 (H2M)',
    'product.kivopay.agent.settlement.desc': 'Pix, 카드, 스테이블코인 사이에서 가장 저렴하고 빠른 경로를 선택하는 결제 레이더 역할을 하는 AI입니다.',
    'product.kivopay.agent.autonomous.title': '자율 에이전트 (M2M)',
    'product.kivopay.agent.autonomous.desc': '인간의 개입 없이 에너지 가격이나 미세 거래를 협상하는 IoT 장치 내장 AI입니다.',
    'product.kivopay.agent.compliance.title': '금융 규제 준수 에이전트',
    'product.kivopay.agent.compliance.desc': '자금 세탁을 감지하고 규제 준수를 보장하기 위해 실시간으로 거래를 모니터링하는 AI입니다.',
    'product.kivopay.agent.fraud-predictor.title': '사기 예측 오라كل',
    'product.kivopay.agent.fraud-predictor.desc': '제로 데이 사기 예측을 위한 신경망 엔진입니다. 생체 인식 벡터 및 장치 지문을 분석합니다.',
    
    // Kivo Pay Features
    'product.kivopay.feature.cross-border.name': '국경 간 송금',
    'product.kivopay.feature.cross-border.desc': '최대 90% 저렴한 수수료로 즉시 해외 송금. USDC로 송금하면 Pix를 통해 BRL로 수령.',
    'product.kivopay.feature.mass-disbursements.name': '대량 지급',
    'product.kivopay.feature.mass-disbursements.desc': '클릭 한 번으로 수백 명의 수취인에게 지급. CSV 업로드, USDC 예치 및 원자적 실행.',
    'product.kivopay.feature.social-fundraising.name': '사회적 모금',
    'product.kivopay.feature.social-fundraising.desc': '투명하고 감사 가능한 크라우드펀딩. 전 세계에서 USDC/BRZ로 기부금 수령.',
    'product.kivopay.feature.m2m-payments.name': 'M2M 자율 결제',
    'product.kivopay.feature.m2m-payments.desc': '인간의 개입 없이 Stellar x402 프로토콜을 통해 이루어지는 미세 거래.',
    'product.kivopay.feature.kivo-terminal.name': 'Kivo 터미널 (POS)',
    'product.kivopay.feature.kivo-terminal.desc': '오프라인 결제를 위한 전용 하드웨어. 견고한 터미널에서 Pix, 카드, 스테이블코인 결제 수락.',
  },
  'ar': {
    'builders.badge': 'للمطورين والشركات',
    'builders.title.part1': 'بنيت من قبل من يفهمون',
    'builders.title.part2': 'الحقيقة.',
    'hero.cta': 'استكشاف المنتجات',
    'hero.title': 'الاقتصاد B2B الجديد.',
    'hero.rail': 'Stellar Global Rails.',
    'hero.rail.ceo': 'سكة مالية عالمية.',
    'hero.rail.dev': 'واجهة برمجة تطبيقات عالمية قابلة للتركيب.',
    'hero.subtitle.ceo': 'ترميز الأصول، وأتمتة العقود وتسوية المدفوعات العالمية على منصة متكاملة واحدة.',
    'hero.subtitle.dev': 'TypeScript/Python SDKs، وwebhooks في الوقت الفعلي ونقاط نهاية أصلية.',
    'howitworks.title': 'هندسة القضبان',
    'howitworks.subtitle': 'كيف نبني جسراً غير مرئي بين الأنظمة القديمة والسيولة على السلسلة.',
    'howitworks.sysarch': 'بنية النظام',
    'howitworks.step1.title': 'الدخول (التهيئة)',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step3.title': 'المجموعة (المنتجات)',
    'howitworks.step4.title': 'الخروج (الدفع)',
    'howitworks.step1.tech': 'تهيئة PIX',
    'howitworks.step2.tech': 'عقد SOROBAN',
    'howitworks.step3.tech': 'نواة التنسيق',
    'howitworks.step4.tech': 'خروج المدفوعات',
    'platform.title': 'ليس منتجاً.',
    'platform.subtitle': 'إنها بنية تحتية.',
    'platform.desc': 'تم بناء النظام المالي التقليدي لأولئك الذين لديهم بالفعل بنك وسجل ضريبي وعنوان ثابت. Stellar Global Rails هي طبقة جديدة - سكة يمكن أن يعمل عليها أي تدفق مالي.',
    'suite.title': 'مجموعة المنتجات.',
    'suite.ai_agents': 'وكلاء الذكاء الاصطناعي',
    'suite.product': 'منتج',
    'suite.explore_product': 'استكشاف المنتج',
    'reach.title.part1': 'صنع للعالم.',
    'reach.title.part2': ' ولد في البرازيل.',
    'nav.products': 'المنتجات',
    'nav.docs': 'التوثيق',
    'nav.how_it_works': 'كيف يعمل',
    'nav.investors': 'للمستثمرين',
    'nav.platform': 'المنصة',
    'profile.business': 'أعمال',
    'profile.developer': 'مطور',
    
    // SocialPay
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': 'حيث يكتسب الاقتصاد وجهاً إنسانياً.',
    'suite.socialpay.tagline': 'حيث يكتسب الاقتصاد وجهاً إنسانياً.',
    'suite.socialpay.desc': 'البوابة البشرية للنظام البيئي Web3. هويات رقمية يمكن التحقق منها، ومعاملات عبر @handle وخلاصة قابلة للتدقيق تحل تعقيد البلوكشين.',
    
    // ContractEase
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': 'حيث تصبح الاتفاقيات غير قابلة للتغيير وذكية.',
    'suite.contractease.tagline': 'حيث تصبح الاتفاقيات غير قابلة للتغيير وذكية.',
    'suite.contractease.desc': 'إدارة عقود B2B ذكية مع ذكاء اصطناعي قانوني. من المسودة إلى التوقيع غير القابل للتغيير، مع التحقق من الامتثال حسب الولاية القضائية.',
    
    // Kivo Pay
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': 'حيث يتحرك المال بسرعة الضوء.',
    'suite.kivopay.tagline': 'حيث يتحرك المال بسرعة الضوء.',
    'suite.kivopay.desc': 'محرك تسوية للبشر والآلات. مدفوعات عبر Pix والعملات المستقرة (H2M) ومدفوعات دقيقة مستقلة عبر بروتوكول x402 لـ IoT (M2M).',

    // Kivo Pay Agents
    'product.kivopay.agent.settlement.title': 'وكيل التسوية الذكي (H2M)',
    'product.kivopay.agent.settlement.desc': 'ذكاء اصطناعي يعمل كرادار للتسوية، يختار المسار الأرخص والأسرع بين Pix والبطاقات والعملات المستقرة.',
    'product.kivopay.agent.autonomous.title': 'الوكيل المستقل (M2M)',
    'product.kivopay.agent.autonomous.desc': 'ذكاء اصطناعي مدمج في أجهزة IoT يتفاوض على أسعار الطاقة أو المعاملات الصغيرة دون تدخل بشري.',
    'product.kivopay.agent.compliance.title': 'وكيل الامتثال المالي',
    'product.kivopay.agent.compliance.desc': 'ذكاء اصطناعي يراقب المعاملات في الوقت الفعلي للكشف عن غسيل الأموال وضمان الامتثال التنظيمي.',
    'product.kivopay.agent.fraud-predictor.title': 'أوراكل التنبؤ بالاحتيال',
    'product.kivopay.agent.fraud-predictor.desc': 'محرك عصبي للتنبؤ بالاحتيال في اليوم صفر. يحلل المتجهات الحيوية وبصمة الجهاز.',
    
    // Kivo Pay Features
    'product.kivopay.feature.cross-border.name': 'الحوالات عبر الحدود',
    'product.kivopay.feature.cross-border.desc': 'إرسال دولي فوري برسوم أقل بنسبة تصل إلى 90%. يخرج USDC ويصل BRL عبر Pix.',
    'product.kivopay.feature.mass-disbursements.name': 'الصرف الجماعي',
    'product.kivopay.feature.mass-disbursements.desc': 'مدفوعات لمئات المستلمين بنقرة واحدة. تحميل CSV وإيداع USDC وتنفيذ ذري.',
    'product.kivopay.feature.social-fundraising.name': 'جمع التبرعات الاجتماعية',
    'product.kivopay.feature.social-fundraising.desc': 'تمويل جماعي شفاف وقابل للتدقيق. أهداف اجتماعية تتلقى تبرعات من جميع أنحاء العالم بـ USDC/BRZ.',
    'product.kivopay.feature.m2m-payments.name': 'مدفوعات M2M المستقلة',
    'product.kivopay.feature.m2m-payments.desc': 'معاملات صغيرة عبر بروتوكول Stellar x402 دون تدخل بشري.',
    'product.kivopay.feature.kivo-terminal.name': 'محطة Kivo (POS)',
    'product.kivopay.feature.kivo-terminal.desc': 'أجهزة مخصصة للمدفوعات دون اتصال بالإنترنت. قبول Pix والبطاقات والعملات المستقرة.',
  }
};

// 1. Extract pt-br keys as template
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
  for (const lang in baseTranslations) {
    const langBlockRegex = new RegExp(`'${lang}':\\s*{[\\s\\S]*?},(\\s*'[a-z\\-]+':|\\s*}\\s*;|\\s*}\\s*$)`, 'm');
    const match = content.match(langBlockRegex);
    
    if (match) {
        let blockText = `'${lang}': {\n`;
        const translatedKeys = baseTranslations[lang];
        
        // Use all keys from pt-br to ensure no missing keys
        Object.keys(ptData).forEach(key => {
            let value = translatedKeys[key] || ptData[key];
            blockText += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
        });
        
        blockText += '  },';
        content = content.replace(match[0], blockText + match[1]);
    }
  }
}

rebuildBlocks();
fs.writeFileSync(uiPath, content);
console.log('Restored and completed translations for zh, ko, ar!');
