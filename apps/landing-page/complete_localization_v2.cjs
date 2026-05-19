const fs = require('fs');
const path = require('path');

const uiPath = path.join(__dirname, 'src', 'i18n', 'ui.ts');
let content = fs.readFileSync(uiPath, 'utf8');

// Section translations (Builders, Reach, Manifesto, Onyx, HowItWorks, Footer)
const translations = {
  'zh': {
    // Builders
    'builders.badge': '为开发者而建',
    'builders.title.part1': '由真正懂的人',
    'builders.title.part2': '所造。',
    'builders.card1.title': '开发者 API',
    'builders.card1.desc': '在数小时内集成，而非数周',
    'builders.card2.title': '完整文档',
    'builders.card2.desc': '开始所需的一切',
    'builders.card3.title': '专业技术支持',
    'builders.card3.desc': '了解 Stellar 的团队',
    'builders.card4.title': '测试沙箱',
    'builders.card4.desc': '无需动用真实资金即可测试',
    'builders.card5.title': '实时 Webhooks',
    'builders.card5.desc': '接收每笔交易的通知',
    'builders.card6.title': 'SLA 保证',
    'builders.card6.desc': '99.9% 的网络正常运行时间',

    // Reach
    'reach.title.part1': '为世界而造。',
    'reach.title.part2': ' 源自巴西。',
    'reach.desc': '不分国家的数字基础设施。我们连接巴西与世界，世界与巴西。',
    'reach.stat1.title': '180+',
    'reach.stat1.desc': '通过 Stellar 可触达的国家',
    'reach.stat2.title': 'R$0.01',
    'reach.stat2.desc': '每笔国际交易的成本',
    'reach.stat3.title': '3-5秒',
    'reach.stat3.desc': '平均结算时间',

    // Manifesto
    'manifesto.mission': '我们的使命',
    'manifesto.title': '民主化全球金融基础设施的访问权。',
    'manifesto.desc': '我们不想成为另一家银行。我们想成为任何人、任何公司或任何机构都可以建立自己的财务解决方案的轨道 —— 无障碍、无官僚主义、无国界。',
    'manifesto.cta_modules': '探索产品',
    'manifesto.cta_investors': '致投资者',

    // Suite - ONYX
    'suite.onyx.title': 'ONYX 合规引擎',
    'suite.onyx.desc': '所有三个产品的交易都由 ONYX 合规引擎实时审计。链上风险、监管合规和可疑模式检测。',
    'suite.onyx.badge': '在所有产品中激活',

    // How It Works
    'howitworks.title': '轨道工程',
    'howitworks.subtitle': '我们如何在传统系统和链上流动性之间建立一座无形的桥梁。',
    'howitworks.sysarch': '系统架构',
    'howitworks.step1.title': '入站 (Onboarding)',
    'howitworks.step1.desc': '用户通过当地方法（Pix, SEP24）以 BRL、USD 或 EUR 支付，完全符合监管要求。',
    'howitworks.step1.tech_desc': '通过当地端点和 AML 获取法定货币流动性。',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': '奇迹发生了：通过 AMM 链上转换为 USDC 或 BRZ，并伴随智能合约的敏捷执行。',
    'howitworks.step2.tech_desc': '执行链上规则和去中心化 USDC 转换。',
    'howitworks.step3.title': '产品套件',
    'howitworks.step3.desc': '基础设施通过集成产品进行控制：可编程托管、复杂的支付拆分和协调的链上发行。',
    'howitworks.step3.tech_desc': '验证完整性、托管和多次转账。',
    'howitworks.step4.title': '出站 (Payout)',
    'howitworks.step4.desc': '在世界任何地方的收款人银行账户或数字钱包中进行最终且确定的结算。',
    'howitworks.step4.tech_desc': '通过直接法定货币网关完成结算。',

    // Footer
    'footer.made_with': '全球金融轨道。基于 Stellar 网络构建。',
    'footer.rights': '版权所有。',
    'footer.updated': '已更新',
  },
  'ko': {
    // Builders
    'builders.badge': '개발자를 위해',
    'builders.title.part1': '진정으로 이해하는 이들이',
    'builders.title.part2': '만들었습니다.',
    'builders.card1.title': '개발자 API',
    'builders.card1.desc': '몇 주가 아닌 몇 시간 만에 통합',
    'builders.card2.title': '완벽한 문서',
    'builders.card2.desc': '시작하는 데 필요한 모든 것',
    'builders.card3.title': '전담 기술 지원',
    'builders.card3.desc': 'Stellar를 이해하는 팀',
    'builders.card4.title': '테스트용 샌드박스',
    'builders.card4.desc': '실제 돈을 쓰지 않고 테스트',
    'builders.card5.title': '실시간 웹훅',
    'builders.card5.desc': '모든 거래에 대한 알림 수신',
    'builders.card6.title': 'SLA 보장',
    'builders.card6.desc': '99.9% 네트워크 가동 시간',

    // Reach
    'reach.title.part1': '세계를 위해 만들어졌습니다.',
    'reach.title.part2': ' 브라질에서 태어났습니다.',
    'reach.desc': '국가를 가리지 않는 디지털 인프라. 브라질과 세계, 세계와 브라질을 연결합니다.',
    'reach.stat1.title': '180+',
    'reach.stat1.desc': 'Stellar를 통해 도달 가능한 국가',
    'reach.stat2.title': 'R$0.01',
    'reach.stat2.desc': '국제 거래당 비용',
    'reach.stat3.title': '3-5초',
    'reach.stat3.desc': '평균 정산 시간',

    // Manifesto
    'manifesto.mission': '우리의 사명',
    'manifesto.title': '글로벌 금융 인프라에 대한 접근성 민주화.',
    'manifesto.desc': '우리는 단순한 또 다른 은행이 되고 싶지 않습니다. 누구나, 어떤 기업이나 기관도 장벽 없이, 관료주의 없이, 국경 없이 자신만의 금융 솔루션을 구축할 수 있는 레일이 되고 싶습니다.',
    'manifesto.cta_modules': '제품 탐색',
    'manifesto.cta_investors': '투자자 전용',

    // Suite - ONYX
    'suite.onyx.title': 'ONYX 컴플라이언스 엔진',
    'suite.onyx.desc': '세 가지 제품의 모든 거래는 ONYX 컴플라이언스 엔진에 의해 실시간으로 감사됩니다. 온체인 위험, 규제 준수 및 의심스러운 패턴 감지.',
    'suite.onyx.badge': '모든 제품에서 활성화됨',

    // How It Works
    'howitworks.title': '레일 엔지니어링',
    'howitworks.subtitle': '기존 시스템과 온체인 유동성 사이에 보이지 않는 가교를 놓는 방법.',
    'howitworks.sysarch': '시스템 아키텍처',
    'howitworks.step1.title': '온보딩 (Onboarding)',
    'howitworks.step1.desc': '사용자는 규제 준수 하에 현지 방식(Pix, SEP24)을 통해 BRL, USD 또는 EUR로 결제합니다.',
    'howitworks.step1.tech_desc': '현지 엔드포인트 및 AML을 통해 법정화폐 유동성 확보.',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': '마법이 일어납니다: AMM을 통한 온체인 USDC 또는 BRZ 변환과 스마트 계약의 신속한 실행.',
    'howitworks.step2.tech_desc': '온체인 규칙 및 탈중앙화 USDC 변환 실행.',
    'howitworks.step3.title': '제품 수트',
    'howitworks.step3.desc': '인프라는 통합 제품을 통해 제어됩니다: 프로그래밍 가능한 에스크로, 복잡한 결제 분할 및 온체인 발행.',
    'howitworks.step3.tech_desc': '무결성, 에스크로 및 다중 송금 검증.',
    'howitworks.step4.title': '지급 (Payout)',
    'howitworks.step4.desc': '전 세계 어디서나 수취인의 은행 계좌나 디지털 지갑으로 최종적이고 확정적인 정산이 이루어집니다.',
    'howitworks.step4.tech_desc': '직접 법정화폐 게이트웨이를 통한 정산 완료.',

    // Footer
    'footer.made_with': '글로벌 금융 레일. Stellar 네트워크 위에서 구축되었습니다.',
    'footer.rights': '모든 권리 보유.',
    'footer.updated': '업데이트됨',
  },
  'ar': {
    // Builders
    'builders.badge': 'للمطورين والشركات',
    'builders.title.part1': 'بنيت من قبل من يفهمون',
    'builders.title.part2': 'الحقيقة.',
    'builders.card1.title': 'واجهات برمجة تطبيقات المطورين',
    'builders.card1.desc': 'تكامل في ساعات وليس أسابيع',
    'builders.card2.title': 'توثيق كامل',
    'builders.card2.desc': 'كل ما تحتاجه للبدء',
    'builders.card3.title': 'دعم فني مخصص',
    'builders.card3.desc': 'فريق يفهم Stellar جيداً',
    'builders.card4.title': 'بيئة اختبار (Sandbox)',
    'builders.card4.desc': 'اختبار دون المساس بأموال حقيقية',
    'builders.card5.title': 'خطافات الويب (Webhooks)',
    'builders.card5.desc': 'تلقي إشعارات لكل معاملة',
    'builders.card6.title': 'ضمان SLA',
    'builders.card6.desc': 'وقت تشغيل الشبكة بنسبة 99.9%',

    // Reach
    'reach.title.part1': 'صنع للعالم.',
    'reach.title.part2': ' ولد في البرازيل.',
    'reach.desc': 'بنية تحتية رقمية لا تختار بلداً. نصل البرازيل بالعالم والعالم بالبرازيل.',
    'reach.stat1.title': '180+',
    'reach.stat1.desc': 'دولة يمكن الوصول إليها عبر Stellar',
    'reach.stat2.title': 'R$0.01',
    'reach.stat2.desc': 'التكلفة لكل معاملة دولية',
    'reach.stat3.title': '3-5 ثوانٍ',
    'reach.stat3.desc': 'متوسط وقت التسوية',

    // Manifesto
    'manifesto.mission': 'مهمتنا',
    'manifesto.title': 'دمقرطة الوصول إلى البنية التحتية المالية العالمية.',
    'manifesto.desc': 'لا نريد أن نكون مجرد بنك آخر. نريد أن نكون القضبان التي يمكن لأي شخص أو شركة أو مؤسسة أن تبني عليها حلولها المالية الخاصة - دون عوائق، ودون بيروقراطية، ودون حدود.',
    'manifesto.cta_modules': 'استكشاف المنتجات',
    'manifesto.cta_investors': 'للمستثمرين',

    // Suite - ONYX
    'suite.onyx.title': 'محرك الامتثال ONYX',
    'suite.onyx.desc': 'يتم تدقيق جميع معاملات المنتجات الثلاثة في الوقت الفعلي بواسطة محرك الامتثال ONYX. مخاطر على السلسلة، وامتثال تنظيمي، وكشف الأنماط المشبوهة.',
    'suite.onyx.badge': 'نشط في جميع المنتجات',

    // How It Works
    'howitworks.title': 'هندسة القضبان',
    'howitworks.subtitle': 'كيف نبني جسراً غير مرئي بين الأنظمة التقليدية والسيولة على السلسلة.',
    'howitworks.sysarch': 'بنية النظام',
    'howitworks.step1.title': 'الدخول (Onboarding)',
    'howitworks.step1.desc': 'يدفع المستخدم بـ BRL أو USD أو EUR عبر طرق محلية (Pix, SEP24) بامتثال تنظيمي كامل.',
    'howitworks.step1.tech_desc': 'التقاط السيولة النقدية عبر النهايات المحلية و AML.',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': 'يحدث السحر: تحويل على السلسلة عبر AMMs إلى USDC أو BRZ مع تنفيذ رشيق للعقود الذكية.',
    'howitworks.step2.tech_desc': 'تنفيذ القواعد على السلسلة وتحويل USDC لامركزي.',
    'howitworks.step3.title': 'مجموعة المنتجات',
    'howitworks.step3.desc': 'تتولى البنية التحتية التحكم عبر المنتجات المتكاملة: الضمان القابل للبرمجة، وتقسيم المدفوعات المعقدة، والإصدار المنسق على السلسلة.',
    'howitworks.step3.tech_desc': 'التحقق من السلامة والضمان والتحويل المتعدد.',
    'howitworks.step4.title': 'الخروج (Payout)',
    'howitworks.step4.desc': 'تسوية نهائية وقطعية في الحساب البنكي أو المحفظة الرقمية للمستلم في أي مكان في العالم.',
    'howitworks.step4.tech_desc': 'إنهاء التسوية عبر بوابة نقدية مباشرة.',

    // Footer
    'footer.made_with': 'قضبان مالية عالمية. بنيت على شبكة Stellar.',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.updated': 'محدث',
  }
};

// Language map for pt-br terminology updates
const ptUpdates = {
  'manifesto.cta_modules': 'Explorar Produtos',
  'ecosystem.title': 'Os Produtos',
};

// Global terminology fix for 'modules' -> 'products' in other languages
const terminologyFixes = {
  'en': {
    'manifesto.cta_modules': 'Explore Products',
    'ecosystem.title': 'The Products',
  },
  'es': {
    'manifesto.cta_modules': 'Explorar Productos',
    'ecosystem.title': 'Los Productos',
  }
};

const ptLines = content.match(/'pt-br':\s*{([\s\S]*?)},/);
const ptData = {};
if (ptLines) {
    const lines = ptLines[1].split('\n');
    lines.forEach(line => {
        const match = line.match(/'([^']+)':\s*'([^']*)',/);
        if (match) {
            let key = match[1];
            let val = match[2];
            if (ptUpdates[key]) val = ptUpdates[key];
            ptData[key] = val;
        }
    });
}

function rebuildBlocks() {
  const languages = ['en', 'es', 'zh', 'ko', 'ar'];
  for (const lang of languages) {
    const langBlockRegex = new RegExp(`'${lang}':\\s*{[\\s\\S]*?},(\\s*'[a-z\\-]+':|\\s*}\\s*;|\\s*}\\s*$)`, 'm');
    const match = content.match(langBlockRegex);
    
    if (match) {
        let blockText = `'${lang}': {\n`;
        const translatedKeys = translations[lang] || {};
        const termFixes = terminologyFixes[lang] || {};
        
        // Read current keys from the block to preserve what's already there
        const currentData = {};
        const blockContent = match[0].match(/{([\s\S]*?)}/)[1];
        blockContent.split('\n').forEach(line => {
            const m = line.match(/'([^']+)':\s*'([^']*)',/);
            if (m) currentData[m[1]] = m[2];
        });

        Object.keys(ptData).forEach(key => {
            let value = translatedKeys[key] || termFixes[key] || currentData[key] || ptData[key];
            blockText += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
        });
        
        blockText += '  },';
        content = content.replace(match[0], blockText + match[1]);
    }
  }

  // Update pt-br block values
  let ptBlock = `'pt-br': {\n`;
  Object.keys(ptData).forEach(key => {
      ptBlock += `    '${key}': '${ptData[key].replace(/'/g, "\\'")}',\n`;
  });
  ptBlock += '  },';
  content = content.replace(/'pt-br':\s*{[\s\S]*?},/, ptBlock);
}

rebuildBlocks();
fs.writeFileSync(uiPath, content);
console.log('REMAINING SECTIONS LOCALIZED AND terminologies UPDATED!');
