(function() {
  const ui = {
    'pt-br': {
      'doc.nav.overview': 'Visão Geral do Ecossistema',
      'doc.nav.product': 'Documento de Produto (ADR)',
      'doc.nav.roadmap': 'Roadmap & Pós-Hackathon',
      'doc.nav.glossary': 'Glossário',
      'doc.nav.ai_global': 'Diretrizes Globais',
      'doc.nav.design_system': 'Design System',
      'doc.nav.supabase': 'Supabase & RLS',
      'doc.nav.specs_contractease': 'Specs: ContractEase',
      'doc.nav.specs_socialpay': 'Specs: SocialPay',
      'doc.nav.specs_kivopay': 'Specs: Kivo Pay',
      'doc.nav.specs_payouts': 'Specs: Stellar Payouts',
      'doc.nav.specs_onyx': 'Specs: Onyx Risk',
      'doc.nav.specs_vakinha': 'Specs: Vakinha Global',
      'doc.nav.specs_familybridge': 'Specs: FamilyBridge',
      'doc.nav.specs_invoice': 'Specs: Stellar Invoice',
      'doc.nav.specs_quilovolt': 'Specs: QuiloVolt',
      'doc.nav.specs_saude360': 'Specs: Saúde 360',
      'doc.nav.specs_escrow': 'Specs: Stellar Escrow',
      'doc.ui.toc': 'Nesta página',
      'doc.ui.focus_mode': 'Modo Foco',
      'doc.ui.edit': 'Editar',
      'doc.ui.updated': 'Atualizado',
      'doc.ui.next': 'Próximo',
      'doc.ui.prev': 'Anterior',
      'doc.ui.notice': '',
      'doc.ui.business_docs': 'Docs de Negócio',
      'doc.ui.ai_specs': 'Specs de IA'
    },
    'en': {
      'doc.nav.overview': 'Ecosystem Overview',
      'doc.nav.product': 'Product Document (ADR)',
      'doc.nav.roadmap': 'Roadmap & Post-Hackathon',
      'doc.nav.glossary': 'Glossary',
      'doc.nav.ai_global': 'Global Guidelines',
      'doc.nav.design_system': 'Design System',
      'doc.nav.supabase': 'Supabase & RLS',
      'doc.nav.specs_contractease': 'Specs: ContractEase',
      'doc.nav.specs_socialpay': 'Specs: SocialPay',
      'doc.nav.specs_kivopay': 'Specs: Kivo Pay',
      'doc.nav.specs_payouts': 'Specs: Stellar Payouts',
      'doc.nav.specs_onyx': 'Specs: Onyx Risk',
      'doc.nav.specs_vakinha': 'Specs: Vakinha Global',
      'doc.nav.specs_familybridge': 'Specs: FamilyBridge',
      'doc.nav.specs_invoice': 'Specs: Stellar Invoice',
      'doc.nav.specs_quilovolt': 'Specs: QuiloVolt',
      'doc.nav.specs_saude360': 'Specs: Health 360',
      'doc.nav.specs_escrow': 'Specs: Stellar Escrow',
      'doc.ui.toc': 'On this page',
      'doc.ui.focus_mode': 'Focus Mode',
      'doc.ui.edit': 'Edit',
      'doc.ui.updated': 'Updated',
      'doc.ui.next': 'Next',
      'doc.ui.prev': 'Previous',
      'doc.ui.notice': 'This page is being translated. Showing original content in Portuguese.',
      'doc.ui.business_docs': 'Business Docs',
      'doc.ui.ai_specs': 'AI Specs'
    },
    'es': {
      'doc.nav.overview': 'Resumen del Ecosistema',
      'doc.nav.product': 'Documento de Producto (ADR)',
      'doc.nav.roadmap': 'Hoja de Ruta y Post-Hackathon',
      'doc.nav.glossary': 'Glosario',
      'doc.nav.ai_global': 'Directrices Globales',
      'doc.nav.design_system': 'Sistema de Diseño',
      'doc.nav.supabase': 'Supabase y RLS',
      'doc.nav.specs_contractease': 'Specs: ContractEase',
      'doc.nav.specs_socialpay': 'Specs: SocialPay',
      'doc.nav.specs_kivopay': 'Specs: Kivo Pay',
      'doc.nav.specs_payouts': 'Specs: Stellar Payouts',
      'doc.nav.specs_onyx': 'Specs: Onyx Risk',
      'doc.nav.specs_vakinha': 'Specs: Vakinha Global',
      'doc.nav.specs_familybridge': 'Specs: FamilyBridge',
      'doc.nav.specs_invoice': 'Specs: Stellar Invoice',
      'doc.nav.specs_quilovolt': 'Specs: QuiloVolt',
      'doc.nav.specs_saude360': 'Specs: Salud 360',
      'doc.nav.specs_escrow': 'Specs: Stellar Escrow',
      'doc.ui.toc': 'En esta página',
      'doc.ui.focus_mode': 'Modo Enfoque',
      'doc.ui.edit': 'Editar',
      'doc.ui.updated': 'Actualizado',
      'doc.ui.next': 'Siguiente',
      'doc.ui.prev': 'Anterior',
      'doc.ui.notice': 'Esta página se está traduciendo. Mostrando contenido original en portugués.',
      'doc.ui.business_docs': 'Docs de Negocios',
      'doc.ui.ai_specs': 'Especificaciones de IA'
    },
    'zh': {
        'doc.nav.overview': '生态系统概览',
        'doc.nav.product': '产品文档 (ADR)',
        'doc.nav.roadmap': '路线图与黑客松后期',
        'doc.nav.glossary': '词汇表',
        'doc.nav.ai_global': '全局指南',
        'doc.nav.design_system': '设计系统',
        'doc.nav.supabase': 'Supabase 和 RLS',
        'doc.nav.specs_contractease': '规格: ContractEase',
        'doc.nav.specs_socialpay': '规格: SocialPay',
        'doc.nav.specs_kivopay': '规格: Kivo Pay',
        'doc.nav.specs_payouts': '规格: Stellar Payouts',
        'doc.nav.specs_onyx': '规格: Onyx Risk',
        'doc.nav.specs_vakinha': '规格: Vakinha Global',
        'doc.nav.specs_familybridge': '规格: FamilyBridge',
        'doc.nav.specs_invoice': '规格: Stellar Invoice',
        'doc.nav.specs_quilovolt': '规格: QuiloVolt',
        'doc.nav.specs_saude360': '规格: 健康 360',
        'doc.nav.specs_escrow': '规格: Stellar Escrow',
        'doc.ui.toc': '本页内容',
        'doc.ui.focus_mode': '专注模式',
        'doc.ui.edit': '编辑',
        'doc.ui.updated': '更新于',
        'doc.ui.next': '下一页',
        'doc.ui.prev': '上一页',
        'doc.ui.notice': '此页面正在翻译中。显示葡萄牙语原内容。',
        'doc.ui.business_docs': '业务文档',
        'doc.ui.ai_specs': 'AI 规格'
    },
    'ko': {
        'doc.nav.overview': '에코시스템 개요',
        'doc.nav.product': '제품 문서 (ADR)',
        'doc.nav.roadmap': '로드맵 및 해커톤 이후',
        'doc.nav.glossary': '용어집',
        'doc.nav.ai_global': '글로벌 가이드라인',
        'doc.nav.design_system': '디자인 시스템',
        'doc.nav.supabase': 'Supabase 및 RLS',
        'doc.nav.specs_contractease': '사양: ContractEase',
        'doc.nav.specs_socialpay': '사양: SocialPay',
        'doc.nav.specs_kivopay': '사양: Kivo Pay',
        'doc.nav.specs_payouts': '사양: Stellar Payouts',
        'doc.nav.specs_onyx': '사양: Onyx Risk',
        'doc.nav.specs_vakinha': '사양: Vakinha Global',
        'doc.nav.specs_familybridge': '사양: FamilyBridge',
        'doc.nav.specs_invoice': '사양: Stellar Invoice',
        'doc.nav.specs_quilovolt': '사양: QuiloVolt',
        'doc.nav.specs_saude360': '사양: 건강 360',
        'doc.nav.specs_escrow': '사양: Stellar Escrow',
        'doc.ui.toc': '이 페이지에서',
        'doc.ui.focus_mode': '포커스 모드',
        'doc.ui.edit': '편집',
        'doc.ui.updated': '업데이트됨',
        'doc.ui.next': '다음',
        'doc.ui.prev': '이전',
        'doc.ui.notice': '이 페이지는 번역 중입니다. 포르투갈어 원본 내용을 표시합니다.',
        'doc.ui.business_docs': '비즈니스 문서',
        'doc.ui.ai_specs': 'AI 사양'
    },
    'ar': {
        'doc.nav.overview': 'نظرة عامة على النظام البيئي',
        'doc.nav.product': 'وثيقة المنتج (ADR)',
        'doc.nav.roadmap': 'خارطة الطريق وما بعد الهاكاثون',
        'doc.nav.glossary': 'قاموس المصطلحات',
        'doc.nav.ai_global': 'المبادئ التوجيهية العالمية',
        'doc.nav.design_system': 'نظام التصميم',
        'doc.nav.supabase': 'سوبابيس و RLS',
        'doc.nav.specs_contractease': 'المواصفات: ContractEase',
        'doc.nav.specs_socialpay': 'المواصفات: SocialPay',
        'doc.nav.specs_kivopay': 'المواصفات: Kivo Pay',
        'doc.nav.specs_payouts': 'المواصفات: Stellar Payouts',
        'doc.nav.specs_onyx': 'المواصفات: Onyx Risk',
        'doc.nav.specs_vakinha': 'المواصفات: Vakinha Global',
        'doc.nav.specs_familybridge': 'المواصفات: FamilyBridge',
        'doc.nav.specs_invoice': 'المواصفات: Stellar Invoice',
        'doc.nav.specs_quilovolt': 'المواصفات: QuiloVolt',
        'doc.nav.specs_saude360': 'المواصفات: الصحة 360',
        'doc.nav.specs_escrow': 'المواصفات: Stellar Escrow',
        'doc.ui.toc': 'في هذه الصفحة',
        'doc.ui.focus_mode': 'وضع التركيز',
        'doc.ui.edit': 'تعديل',
        'doc.ui.updated': 'تم التحديث',
        'doc.ui.next': 'التالي',
        'doc.ui.prev': 'السابق',
        'doc.ui.notice': 'هذه الصفحة قيد الترجمة حالياً. عرض المحتوى الأصلي باللغة البرتغالية.',
        'doc.ui.business_docs': 'وثائق الأعمال',
        'doc.ui.ai_specs': 'مواصفات الذكاء الاصطناعي'
    }
  };

  window.i18n = {
    updateUI: function() {
      const lang = localStorage.getItem('sgr-lang') || 'en';
      const t = ui[lang] || ui['en'];

      // Update Nav Links
      document.querySelectorAll('.nav-link').forEach(el => {
        const key = el.getAttribute('data-key');
        if (key && t[key]) el.innerText = t[key];
      });

      // Update Section Titles
      const sections = document.querySelectorAll('.doc-section');
      const titles = lang === 'pt-br' ? ['Fundamentos', 'Módulos', 'Core', 'Specs por Módulo'] : 
                    lang === 'es' ? ['Fundamentos', 'Módulos', 'Núcleo', 'Especificaciones'] :
                    lang === 'zh' ? ['基础', '模块', '核心', '规格'] :
                    lang === 'ko' ? ['기초', '모듈', '코어', '사양'] :
                    lang === 'ar' ? ['الأساسيات', 'الوحدات', 'الأساس', 'المواصفات'] :
                    ['Fundamentals', 'Modules', 'Core', 'Specs by Module'];
      
      document.querySelectorAll('.section-title').forEach((el, i) => {
        if (titles[i]) el.innerText = titles[i];
      });

      // UI Elements
      const tocHeader = document.getElementById('toc-header');
      if (tocHeader) tocHeader.innerText = t['doc.ui.toc'];

      const focusModeLabel = document.getElementById('focus-mode-label');
      if (focusModeLabel) focusModeLabel.innerText = t['doc.ui.focus_mode'];

      const editLabel = document.querySelector('#edit-link span');
      if (editLabel) editLabel.innerText = t['doc.ui.edit'];

      const footerUpdate = document.getElementById('footer-update-label');
      if (footerUpdate) footerUpdate.innerText = `${t['doc.ui.updated']}: 09 Maio, 2026`;

      const nextPrevLabels = document.querySelectorAll('.next-prev-label');
      nextPrevLabels.forEach(el => {
        const type = el.getAttribute('data-type');
        el.innerText = t[`doc.ui.${type}`];
      });

      const contextSwitchLabel = document.getElementById('context-switch-label');
      if (contextSwitchLabel) {
        const isAi = window.location.pathname.includes('/doc/ai');
        contextSwitchLabel.innerText = isAi ? t['doc.ui.business_docs'] : t['doc.ui.ai_specs'];
      }

      // Notice
      const notice = document.getElementById('i18n-notice');
      const noticeText = document.getElementById('i18n-notice-text');
      if (notice && noticeText) {
        if (lang !== 'pt-br') {
          notice.classList.remove('hidden');
          noticeText.innerText = t['doc.ui.notice'];
        } else {
          notice.classList.add('hidden');
        }
      }
    }
  };
})();
