const fs = require('fs');
const path = require('path');

const uiPath = path.join(__dirname, 'src', 'i18n', 'ui.ts');
let content = fs.readFileSync(uiPath, 'utf8');

const fullTranslations = {
  'zh': {
    // Hero & Platform (Done)
    // SocialPay
    'product.socialpay.hero.title': 'Web3 生态系统的人性化入口。',
    'product.socialpay.hero.subtitle': '可验证的数字身份、通过 @handle 进行的交易以及解决区块链复杂性的可审计馈送。',
    'product.socialpay.feature.data-vault.name': '私有数据保险库',
    'product.socialpay.feature.data-vault.desc': '端到端加密管理敏感数据。您决定谁可以访问您的数据并实现货币化。',
    'product.socialpay.feature.community-marketplace.name': '社区市场',
    'product.socialpay.feature.community-marketplace.desc': '社交和 P2P 市场的底层设施。直接通过 @handle 买卖数字服务或产品。',
    'product.socialpay.feature.p2p-split.name': '社交支付拆分',
    'product.socialpay.feature.p2p-split.desc': '立即与朋友分摊账单。拆分引擎自动路由交易并在账本上结算。',
    'product.socialpay.feature.reputation-score.name': '链上声誉评分',
    'product.socialpay.feature.reputation-score.desc': '基于社交连接和交易历史构建您的信任分数。可验证且不可更改。',
    'product.socialpay.agent.identity.title': '数字身份代理',
    'product.socialpay.agent.identity.desc': '用于实时验证文件、检测欺诈并确保监管合规的 AI。',
    'product.socialpay.agent.engagement.title': '社交参与代理',
    'product.socialpay.agent.engagement.desc': '基于用户行为建议连接、互动和参与活动的 AI。',
    'product.socialpay.agent.health.title': '数字健康代理',
    'product.socialpay.agent.health.desc': '解释健康钱包数据并建议个性化提醒或建议的 AI。',
    
    // ContractEase
    'product.contractease.hero.title': '带有法律 AI 的智能 B2B 合同管理。',
    'product.contractease.hero.subtitle': '从草案到不可篡改的签名。按司法管辖区验证合规性的 AI、创建向导和 Stellar 永久注册。',
    'product.contractease.feature.onchain-invoicing.name': '链上开票',
    'product.contractease.feature.onchain-invoicing.desc': '具有法律效力和区块链注册的开票。生成 B2B 发票并以 USDC 接收。',
    'product.contractease.feature.asset-tokenization.name': '资产代币化向导',
    'product.contractease.feature.asset-tokenization.desc': '发行现实世界资产 (RWA) 的平台。从债务债券到碳信用额度的代币化。',
    'product.contractease.feature.compliance-ledger.name': '全球合规 API',
    'product.contractease.feature.compliance-ledger.desc': '与 ONYX 引擎原生集成。实时风险验证和自动链上审计。',
    'product.contractease.feature.multi-sig-workflow.name': '可视化多签审批',
    'product.contractease.feature.multi-sig-workflow.desc': '创建复杂的董事会审批流。界面可视化注入区块链的治理。',
    'product.contractease.agent.ia-juridica.title': '法律 AI (司法管辖区)',
    'product.contractease.agent.ia-juridica.desc': '自动按所选国家司法管辖区验证文件和条款的法律合规性。',
    'product.contractease.agent.ia-negociacao.title': '自主谈判代理',
    'product.contractease.agent.ia-negociacao.desc': '分析合同修改并基于公司风险生成即时反向提案的 AI。',
    'product.contractease.agent.ia-arbitragem.title': '纠纷解决代理',
    'product.contractease.agent.ia-arbitragem.desc': '审核智能合约条件并建议中立裁决的 AI 预言机。',

    // Kivo Pay
    'product.kivopay.hero.title': '人和机器的结算引擎。',
    'product.kivopay.hero.subtitle': '通过 Pix 和稳定币进行支付 (H2M)，并通过 IoT 的 x402 协议进行自主微支付 (M2M)。',
  },
  'ko': {
    // SocialPay
    'product.socialpay.hero.title': 'Web3 생태계로의 인간적인 관문.',
    'product.socialpay.hero.subtitle': '검증 가능한 디지털 신원, @handle을 통한 거래 및 블록체인 복잡성을 해결하는 감사 가능한 피드.',
    'product.socialpay.feature.data-vault.name': '개인 데이터 금고',
    'product.socialpay.feature.data-vault.desc': '엔드투엔드 암호화로 민감한 데이터를 관리합니다. 데이터 액세스 권한을 직접 결정하고 수익화할 수 있습니다.',
    'product.socialpay.feature.community-marketplace.name': '커뮤니티 마켓플레이스',
    'product.socialpay.feature.community-marketplace.desc': '소셜 및 P2P 마켓플레이스를 위한 인프라. @handle을 통해 직접 디지털 서비스나 제품을 사고팔 수 있습니다.',
    'product.socialpay.feature.p2p-split.name': '소셜 결제 분할',
    'product.socialpay.feature.p2p-split.desc': '친구들과 즉시 비용을 정산하세요. 분할 엔진이 자동으로 거래를 라우팅하고 원장에서 결제합니다.',
    'product.socialpay.feature.reputation-score.name': '온체인 평판 점수',
    'product.socialpay.feature.reputation-score.desc': '소셜 연결 및 거래 내역을 기반으로 신뢰 점수를 구축하세요. 검증 가능하며 변경할 수 없습니다.',
    'product.socialpay.agent.identity.title': '디지털 신원 에이전트',
    'product.socialpay.agent.identity.desc': '문서 검증, 사기 감지 및 규제 준수를 실시간으로 보장하는 AI입니다.',
    'product.socialpay.agent.engagement.title': '소셜 참여 에이전트',
    'product.socialpay.agent.engagement.desc': '사용자 행동에 기반하여 연결, 상호 작용 및 참여 캠페인을 제안하는 AI입니다.',
    'product.socialpay.agent.health.title': '디지털 건강 에이전트',
    'product.socialpay.agent.health.desc': '건강 지갑 데이터를 해석하고 개인화된 알림이나 추천을 제안하는 AI입니다.',

    // ContractEase
    'product.contractease.hero.title': '법률 AI가 포함된 스마트 B2B 계약 관리.',
    'product.contractease.hero.subtitle': '초안부터 불변의 서명까지. 관할권별 규제 준수 검증 AI, 생성 마법사 및 Stellar 영구 등록.',
    'product.contractease.feature.onchain-invoicing.name': '온체인 인보이싱',
    'product.contractease.feature.onchain-invoicing.desc': '법적 효력과 블록체인 등록을 갖춘 인보이싱. B2B 송장을 생성하고 USDC로 결제받으세요.',
    'product.contractease.feature.asset-tokenization.name': '자산 토큰화 마법사',
    'product.contractease.feature.asset-tokenization.desc': '실물 자산(RWA) 발행 플랫폼. 채권에서 탄소 배출권까지 토큰화하세요.',
    'product.contractease.feature.compliance-ledger.name': '글로벌 컴플라이언스 API',
    'product.contractease.feature.compliance-ledger.desc': 'ONYX 엔진과 기본 통합. 실시간 위험 검증 및 자동 온체인 감사.',
    'product.contractease.feature.multi-sig-workflow.name': '시각적 다중 서명 승인',
    'product.contractease.feature.multi-sig-workflow.desc': '복잡한 이사회 승인 흐름을 생성하세요. 블록체인에 주입된 거버넌스를 시각화합니다.',
    'product.contractease.agent.ia-juridica.title': '법률 AI (관할권)',
    'product.contractease.agent.ia-juridica.desc': '선택한 국가의 관할권에 따라 문서 및 조항의 법적 준수 여부를 자동으로 검증합니다.',
    'product.contractease.agent.ia-negociacao.title': '자율 협상 에이전트',
    'product.contractease.agent.ia-negociacao.desc': '계약 수정을 분석하고 회사 위험에 기반하여 즉각적인 반대 제안을 생성하는 AI입니다.',
    'product.contractease.agent.ia-arbitragem.title': '분쟁 해결 에이전트',
    'product.contractease.agent.ia-arbitragem.desc': '스마트 계약 조건을 감사하고 중립적인 판결을 제안하는 AI 오라클입니다.',

    // Kivo Pay
    'product.kivopay.hero.title': '인간과 기계를 위한 결제 엔진.',
    'product.kivopay.hero.subtitle': 'Pix 및 스테이블코인을 통한 결제(H2M)와 IoT용 x402 프로토콜을 통한 자율 미세 결제(M2M).',
  },
  'ar': {
    // SocialPay
    'product.socialpay.hero.title': 'البوابة البشرية للنظام البيئي Web3.',
    'product.socialpay.hero.subtitle': 'هويات رقمية يمكن التحقق منها، ومعاملات عبر @handle وخلاصة قابلة للتدقيق تحل تعقيد البلوكشين.',
    'product.socialpay.feature.data-vault.name': 'خزنة البيانات الخاصة',
    'product.socialpay.feature.data-vault.desc': 'إدارة البيانات الحساسة بتشفير طرف إلى طرف. أنت تقرر من يصل إلى بياناتك ويمكنك تحقيق الربح منها.',
    'product.socialpay.feature.community-marketplace.name': 'سوق المجتمع',
    'product.socialpay.feature.community-marketplace.desc': 'بنية تحتية للأسواق الاجتماعية وP2P. شراء وبيع الخدمات الرقمية مباشرة عبر @handle.',
    'product.socialpay.feature.p2p-split.name': 'تقسيم الدفع الاجتماعي',
    'product.socialpay.feature.p2p-split.desc': 'تقسيم الفواتير مع الأصدقاء على الفور. يقوم محرك التقسيم بتوجيه المعاملات تلقائياً وتسويتها.',
    'product.socialpay.feature.reputation-score.name': 'درجة السمعة على السلسلة',
    'product.socialpay.feature.reputation-score.desc': 'بناء درجة الثقة بناءً على الاتصالات الاجتماعية وسجل المعاملات. قابلة للتحقق وغير قابلة للتغيير.',
    'product.socialpay.agent.identity.title': 'وكيل الهوية الرقمية',
    'product.socialpay.agent.identity.desc': 'ذكاء اصطناعي للتحقق من الوثائق واكتشاف الاحتيال وضمان الامتثال التنظيمي في الوقت الفعلي.',
    'product.socialpay.agent.engagement.title': 'وكيل المشاركة الاجتماعية',
    'product.socialpay.agent.engagement.desc': 'ذكاء اصطناعي يقترح الاتصالات والتفاعلات وحملات المشاركة بناءً على سلوك المستخدم.',
    'product.socialpay.agent.health.title': 'وكيل الصحة الرقمي',
    'product.socialpay.agent.health.desc': 'ذكاء اصطناعي يفسر بيانات محفظة الصحة ويقترح تنبيهات أو توصيات شخصية.',

    // ContractEase
    'product.contractease.hero.title': 'إدارة عقود B2B ذكية مع ذكاء اصطناعي قانوني.',
    'product.contractease.hero.subtitle': 'من المسودة إلى التوقيع غير القابل للتغيير. ذكاء اصطناعي للتحقق من الامتثال، ومعالج إنشاء وتسجيل Stellar دائم.',
    'product.contractease.feature.onchain-invoicing.name': 'الفواتير على السلسلة',
    'product.contractease.feature.onchain-invoicing.desc': 'فواتير ذات صلاحية قانونية وتسجيل على البلوكشين. إنشاء فواتير B2B واستلامها بـ USDC.',
    'product.contractease.feature.asset-tokenization.name': 'معالج ترميز الأصول',
    'product.contractease.feature.asset-tokenization.desc': 'منصة لإصدار الأصول الحقيقية (RWA). ترميز كل شيء من سندات الدين إلى أرصدة الكربون.',
    'product.contractease.feature.compliance-ledger.name': 'واجهة برمجة تطبيقات الامتثال العالمي',
    'product.contractease.feature.compliance-ledger.desc': 'تكامل أصلي مع محرك ONYX. التحقق من المخاطر في الوقت الفعلي والتدقيق التلقائي على السلسلة.',
    'product.contractease.feature.multi-sig-workflow.name': 'موافقة متعددة التوقيع مرئية',
    'product.contractease.feature.multi-sig-workflow.desc': 'إنشاء تدفقات موافقة مجلس إدارة معقدة. واجهة تعرض الحوكمة المحقونة في البلوكشين.',
    'product.contractease.agent.ia-juridica.title': 'ذكاء اصطناعي قانوني (اختصاص قضائي)',
    'product.contractease.agent.ia-juridica.desc': 'التحقق التلقائي من الامتثال القانوني للوثائق والبنود حسب الاختصاص القضائي المختار.',
    'product.contractease.agent.ia-negociacao.title': 'وكيل التفاوض المستقل',
    'product.contractease.agent.ia-negociacao.desc': 'ذكاء اصطناعي يحلل تعديلات العقود وينشئ مقترحات مضادة فورية بناءً على مخاطر الشركة.',
    'product.contractease.agent.ia-arbitragem.title': 'وكيل حل النزاعات',
    'product.contractease.agent.ia-arbitragem.desc': 'أوراكل ذكاء اصطناعي يدقق في شروط العقود الذكية ويقترح أحكاماً محايدة.',

    // Kivo Pay
    'product.kivopay.hero.title': 'محرك تسوية للبشر والآلات.',
    'product.kivopay.hero.subtitle': 'مدفوعات عبر Pix والعملات المستقرة (H2M) ومدفوعات دقيقة مستقلة عبر بروتوكول x402 لـ IoT (M2M).',
  }
};

// ... keep existing baseTranslations and merge them in ...
// I will just use the rebuild_global_translations logic but with MORE keys.

const ptLines = content.match(/'pt-br':\s*{([\s\S]*?)},/);
const ptData = {};
if (ptLines) {
    const lines = ptLines[1].split('\n');
    lines.forEach(line => {
        const match = line.match(/'([^']+)':\s*'([^']*)',/);
        if (match) ptData[match[1]] = match[2];
    });
}

// Merge additional translations into a master object
const finalData = {};
for (const lang in fullTranslations) {
    finalData[lang] = { ...fullTranslations[lang] };
}

function rebuildBlocks() {
  for (const lang in finalData) {
    const langBlockRegex = new RegExp(`'${lang}':\\s*{[\\s\\S]*?},(\\s*'[a-z\\-]+':|\\s*}\\s*;|\\s*}\\s*$)`, 'm');
    const match = content.match(langBlockRegex);
    
    if (match) {
        let blockText = `'${lang}': {\n`;
        const translatedKeys = finalData[lang];
        
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
console.log('Final polish applied for zh, ko, ar product translations!');
