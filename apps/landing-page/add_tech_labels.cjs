const fs = require('fs');

const filePath = 'src/i18n/ui.ts';
let content = fs.readFileSync(filePath, 'utf8');

const techLabels = {
  'pt-br': {
    'howitworks.step1.tech': 'ONBOARDING_PIX',
    'howitworks.step2.tech': 'CONTRATO_SOROBAN',
    'howitworks.step3.tech': 'CORE_ORQUESTRAÇÃO',
    'howitworks.step4.tech': 'SAÍDA_PAYOUT',
  },
  'en': {
    'howitworks.step1.tech': 'ONBOARDING_PIX',
    'howitworks.step2.tech': 'SOROBAN_CONTRACT',
    'howitworks.step3.tech': 'ORCHESTRATION_CORE',
    'howitworks.step4.tech': 'OFF_RAMP_PAYOUT',
  },
  'es': {
    'howitworks.step1.tech': 'ONBOARDING_PIX',
    'howitworks.step2.tech': 'CONTRATO_SOROBAN',
    'howitworks.step3.tech': 'NÚCLEO_ORQUESTRAÇÃO',
    'howitworks.step4.tech': 'SALIDA_PAYOUT',
  },
  'zh': {
    'howitworks.step1.tech': '入站 PIX',
    'howitworks.step2.tech': 'SOROBAN 合约',
    'howitworks.step3.tech': '核心编排',
    'howitworks.step4.tech': '出站支付',
  },
  'ko': {
    'howitworks.step1.tech': '온보딩 PIX',
    'howitworks.step2.tech': 'SOROBAN 계약',
    'howitworks.step3.tech': '코어 오케스트레이션',
    'howitworks.step4.tech': '아웃바운드 지급',
  },
  'ar': {
    'howitworks.step1.tech': 'تهيئة PIX',
    'howitworks.step2.tech': 'عقد SOROBAN',
    'howitworks.step3.tech': 'نواة التنسيق',
    'howitworks.step4.tech': 'خروج المدفوعات',
  }
};

// Function to safely update the file
function updateLangBlock(content, lang, data) {
  const blockRegex = new RegExp(`'${lang}': \\{([\\s\\S]*?)\\},`, 'm');
  const match = content.match(blockRegex);
  if (!match) return content;
  
  let blockContent = match[1];
  for (const [key, value] of Object.entries(data)) {
    const entryRegex = new RegExp(`'${key}': '((?:[^'\\\\]|\\\\.)*)',?`, 'g');
    if (blockContent.match(entryRegex)) {
      blockContent = blockContent.replace(entryRegex, `'${key}': '${value.replace(/'/g, "\\'")}',`);
    } else {
      blockContent += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
    }
  }
  
  return content.replace(match[0], `'${lang}': {${blockContent}},`);
}

for (const [lang, data] of Object.entries(techLabels)) {
  content = updateLangBlock(content, lang, data);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Tech labels added to ui.ts.');
