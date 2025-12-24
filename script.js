// 基础交互功能
document.addEventListener('DOMContentLoaded', function() {
    
    // 主题切换逻辑
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // 初始化主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme !== 'light') {
        htmlElement.setAttribute('data-theme', savedTheme);
    }
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            let newTheme = 'light';
            
            // 循环切换：Light -> Dark -> Warm -> Light
            if (currentTheme === 'light') {
                newTheme = 'dark';
            } else if (currentTheme === 'dark') {
                newTheme = 'warm';
            } else {
                newTheme = 'light';
            }
            
            if (newTheme === 'light') {
                htmlElement.removeAttribute('data-theme');
            } else {
                htmlElement.setAttribute('data-theme', newTheme);
            }
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.textContent = '🌙';
            themeToggleBtn.title = '当前：暗色模式';
        } else if (theme === 'warm') {
            themeToggleBtn.textContent = '☕';
            themeToggleBtn.title = '当前：暖色模式';
        } else {
            themeToggleBtn.textContent = '☀️';
            themeToggleBtn.title = '当前：亮色模式';
        }
    }

    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const navHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 导航栏激活状态
    const sections = document.querySelectorAll('.section[id]');
    const navLinksArray = Array.from(navLinks);

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 200;

        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                break;
            }
        }
    }

    // 滚动时更新导航状态
    window.addEventListener('scroll', updateActiveNavLink);

    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.principle-card, .constraint-card, .application-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 优化的淡入动画
    const observerOptions = {
        threshold: 0.05,  // 更早触发
        rootMargin: '0px 0px 50px 0px'  // 提前50px触发
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // 为卡片添加初始状态并观察（优化延迟）
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        // 减少累积延迟：分组动画而不是逐个延迟
        const groupIndex = Math.floor(index / 4); // 每4个卡片为一组
        const delay = groupIndex * 0.1; // 组间延迟0.1s，组内同时开始

        card.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
        observer.observe(card);
    });

    // 移动端导航优化
    let isMobile = window.innerWidth <= 768;
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(e) {
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            // 可以在这里添加滑动手势逻辑
        }
    }

    if (isMobile) {
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
    }

    // 窗口大小改变时更新移动端状态
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        }
    });

    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // 打印优化
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });

    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            let block = this.parentElement.querySelector('.prompt-block');
            if (!block) {
                const sel = this.getAttribute('data-copy-target');
                if (sel) {
                    block = document.querySelector(sel);
                }
            }
            if (!block) return;
            try {
                await navigator.clipboard.writeText(block.textContent.trim());
                const original = this.textContent;
                this.textContent = '已复制';
                setTimeout(() => { this.textContent = original; }, 1500);
            } catch (e) {
                // Fallback
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(block);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('copy');
                selection.removeAllRanges();
                const original = this.textContent;
                this.textContent = '已复制';
                setTimeout(() => { this.textContent = original; }, 1500);
            }
        });
    });

    fetch('data/refactoring-ui-principles.json')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            const container = document.querySelector('#refactoring-ui .principles-grid');
            if (!container) return;
            data.principles.forEach(function(section) {
                const card = document.createElement('div');
                card.className = 'principle-card';
                const title = document.createElement('h3');
                title.className = 'principle-title';
                title.textContent = section.category;
                const list = document.createElement('ul');
                list.className = 'principle-points';
                section.items.forEach(function(item) {
                    const li = document.createElement('li');
                    li.textContent = item;
                    list.appendChild(li);
                });
                card.appendChild(title);
                card.appendChild(list);
                container.appendChild(card);
            });
        });

    fetch('data/ai-exec-spec.json')
        .then(function(res) { return res.json(); })
        .then(function(spec) {
            const grid = document.getElementById('ai-exec-grid');
            if (!grid) return;
            spec.categories.forEach(function(cat) {
                const card = document.createElement('div');
                card.className = 'principle-card';
                const title = document.createElement('h3');
                title.className = 'principle-title';
                title.textContent = cat.name;
                const list = document.createElement('ul');
                list.className = 'principle-points';
                cat.rules.forEach(function(rule) {
                    const li = document.createElement('li');
                    li.textContent = rule.description;
                    list.appendChild(li);
                });
                card.appendChild(title);
                card.appendChild(list);
                grid.appendChild(card);
            });
        });

    fetch('data/ai-exec-core.json')
        .then(function(res) { return res.json(); })
        .then(function(core) {
            const grid = document.getElementById('ai-core-grid');
            if (!grid) return;
            core.gates.forEach(function(g) {
                const card = document.createElement('div');
                card.className = 'principle-card';
                const title = document.createElement('h3');
                title.className = 'principle-title';
                title.textContent = g.desc;
                const list = document.createElement('ul');
                list.className = 'principle-points';
                const li = document.createElement('li');
                li.textContent = JSON.stringify(g.target);
                list.appendChild(li);
                card.appendChild(title);
                card.appendChild(list);
                grid.appendChild(card);
            });
        });

    fetch('data/prompt-framework.json')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            initPromptFramework(data);
        })
        .catch(function(err) {
            console.error('Failed to load prompt framework', err);
        });

    fetch('data/tool-shortcuts.json')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            initToolShortcuts(data);
        })
        .catch(function(err) {
            console.error('Failed to load tool shortcuts', err);
        });

    const styleEmbedSource = [
        { 
            name: 'Monochrome', 
            tone: '白',
            prompt: "A stark, editorial design system built on pure black and white. No accent colors—just dramatic contrast, oversized serif typography, and precise geometric layouts. Evokes high-end fashion editorials and architectural portfolios. Austere, sophisticated, unapologetically bold."
        },
        { 
            name: 'Bauhaus', 
            tone: '白',
            prompt: "A functionalist design language rooted in the Weimar era. Characterized by primary colors (Red #FF0000, Blue #0000FF, Yellow #FFFF00), strict geometric shapes, unbalanced asymmetry, and clean sans-serif typography. Forms follow function with industrial precision and artistic flair."
        },
        { 
            name: 'Modern Dark', 
            tone: '黑',
            prompt: "A sophisticated dark mode interface featuring deep charcoal backgrounds (#121212), subtle gradients, and vibrant accent colors for high legibility. Utilizes glassmorphism, soft shadows, and refined sans-serif fonts to create a sleek, immersive digital environment."
        },
        { 
            name: 'Newsprint', 
            tone: '白',
            prompt: "Evocative of classic newspaper layout. High-contrast black serif typography on off-white or slightly yellowed paper texture backgrounds. Multi-column grids, justified text, and hairline dividers create a trustworthy, information-dense aesthetic."
        },
        { 
            name: 'SaaS', 
            tone: '白',
            prompt: "Clean, trustworthy, and conversion-optimized. Features ample white space, friendly rounded sans-serif fonts, and a calming blue or purple primary color. consistent iconography, soft drop shadows, and clear calls-to-action define this business-ready style."
        },
        { 
            name: 'Luxury', 
            tone: '白',
            prompt: "Elegant and understated. frequent use of serif headings, gold or metallic accents, and generous negative space. muted palette of creams, blacks, and metallics. conveys exclusivity, high quality, and timeless sophistication."
        },
        { 
            name: 'Terminal', 
            tone: '黑',
            prompt: "Retro-futuristic command line aesthetic. Monospaced fonts (Courier, Fira Code), high-contrast neon green or amber text on deep black backgrounds. ASCII art elements, blinking cursors, and raw code snippets create a developer-centric vibe."
        },
        { 
            name: 'Swiss Minimalist', 
            tone: '白',
            prompt: "The International Typographic Style. Objective, photography-based, and grid-driven. Uses Helvetica or similar neo-grotesque sans-serifs, flush-left rag-right text, and asymmetric layouts. Prioritizes readability, objectivity, and cleanliness."
        },
        { 
            name: 'Kinetic', 
            tone: '黑',
            prompt: "Dynamic and high-energy. Features bold typography that breaks the grid, marquee scrolling text, and vibrant, high-saturation colors. Emphasizes motion, interaction, and a sense of constant movement suitable for sports or lifestyle brands."
        },
        { 
            name: 'Flat Design', 
            tone: '白',
            prompt: "Two-dimensional illustration style with bright, cheerful colors and no gradients or shadows. Simple shapes, clean typography, and a focus on usability and fast loading times. Friendly, approachable, and highly scalable."
        },
        { 
            name: 'Art Deco', 
            tone: '黑',
            prompt: "Glamorous and decorative style from the 1920s. Geometric patterns like sunbursts and zigzags, rich colors like gold, black, and deep emerald.  Luxurious, symmetrical, and streamlined, evoking the Jazz Age and Great Gatsby."
        },
        { 
            name: 'Material Design', 
            tone: '白',
            prompt: "Google's design language based on paper and ink. Uses shadows to create depth, vibrant colors, and responsive animations. Grid-based layouts, responsive interactions, and a focus on tactile reality within a digital space."
        },
        { 
            name: 'Neo Brutalism', 
            tone: '白',
            prompt: "Raw, unpolished, and anti-design. High contrast, clashing colors, plain web-safe fonts, and visible borders. Rejects modern refinement for a bold, honest, and sometimes jarring aesthetic that stands out."
        },
        { 
            name: 'Bold Typography', 
            tone: '黑',
            prompt: "Type as image. Massive, screen-filling headlines dominate the layout. Minimal imagery, high contrast (often black and white), and a focus on the message itself. Powerful, loud, and impossible to ignore."
        },
        { 
            name: 'Academia', 
            tone: '白',
            prompt: "Scholarly and classic. Serif typography, muted earth tones (browns, greens, creams), and textures reminiscent of old books or tweed. Layouts feel structured and traditional, evoking libraries, universities, and historical archives."
        },
        { 
            name: 'Cyberpunk', 
            tone: '黑',
            prompt: "High-tech, low-life. Neon colors (magenta, cyan) against dark, gritty cityscapes. Glitch effects, Japanese characters, and futuristic UI elements. dystopian, energetic, and visually overwhelmed."
        },
        { 
            name: 'Web3', 
            tone: '黑',
            prompt: "Futuristic and decentralized. Dark gradients, mesh gradients, glassmorphism, and abstract 3D shapes.  Clean sans-serif fonts and a palette of deep purples, blues, and neon pinks. Evokes blockchain, crypto, and the metaverse."
        },
        { 
            name: 'Playful Geometric', 
            tone: '白',
            prompt: "Fun and approachable. Uses basic geometric shapes (circles, triangles, squares) in bright, pastel or primary colors.  Rounded corners, bouncy animations, and a sense of joy and creativity. Great for creative agencies or educational tools."
        },
        { 
            name: 'Minimal Dark', 
            tone: '黑',
            prompt: "Ultra-clean dark mode. Pure black or very dark grey backgrounds with stark white typography. Minimal decorative elements, focus on content and negative space. Reduces eye strain and looks premium."
        },
        { 
            name: 'Claymorphism', 
            tone: '白',
            prompt: "3D floating elements that look like clay. Soft, inflated shapes with inner shadows and outer drop shadows.  Pastel colors, rounded corners, and a friendly, tactile feel. A modern, softer evolution of Neumorphism."
        },
        { 
            name: 'Professional', 
            tone: '白',
            prompt: "Corporate and reliable. Navy blues, greys, and whites.  Traditional grid layouts, stock photography or clean vector illustrations, and safe, readable fonts (Arial, Roboto).  Communicates stability, trust, and enterprise readiness."
        },
        { 
            name: 'Botanical', 
            tone: '白',
            prompt: "Nature-inspired and organic. Palette of greens, browns, and floral colors.  Use of plant illustrations or photography, serif fonts, and soft, natural textures.  Calming, sustainable, and fresh."
        },
        { 
            name: 'Vaporwave', 
            tone: '黑',
            prompt: "A nostalgic 80s/90s aesthetic. Pink and blue gradients, tropical imagery, glitch art, and classical statues.  Lo-fi vibes, checkerboard patterns, and retro computer graphics.  Dreamy, surreal, and ironic."
        },
        { 
            name: 'Enterprise', 
            tone: '白',
            prompt: "Scalable and dense. Information-heavy dashboards, data visualization tables, and complex navigation structures.  Neutral color palette with clear status indicators (red, green, amber).  Focus on utility and efficiency."
        },
        { 
            name: 'Sketch', 
            tone: '白',
            prompt: "Hand-drawn and unfinished look. Pencil or charcoal textures, rough edges, and handwritten fonts.  Diagrammatic elements, arrows, and annotations.  Communicates brainstorming, creativity, and work-in-progress."
        },
        { 
            name: 'Industrial', 
            tone: '白',
            prompt: "Raw and functional. Exposed grids, technical typography, and a palette of concrete greys, safety yellows, and blacks.  Use of technical drawings, blueprints, and monospaced fonts.  Robust, engineered, and precise."
        },
        { 
            name: 'Neumorphism', 
            tone: '白',
            prompt: "Soft UI. Elements appear to be extruded from the background. Low contrast, subtle shadows and highlights create a tactile, plastic-like surface.  Monochromatic or low-saturation palettes.  Futuristic yet soft."
        },
        { 
            name: 'Organic', 
            tone: '白',
            prompt: "Fluid and natural. Curved lines, blob shapes, and asymmetry.  Warm, earthy colors and textures.  Avoids sharp corners and rigid grids.  Feels human, approachable, and flowing."
        },
        { 
            name: 'Maximalism', 
            tone: '白',
            prompt: "More is more. Clashing patterns, saturated colors, dense layering, and bold typography.  Fills every pixel with visual interest.  Chaotic, energetic, and confident rejection of minimalism."
        },
        { 
            name: 'Retro', 
            tone: '白',
            prompt: "Vintage appeal from the 50s/60s/70s.  Warm, yellowed color palettes, grain textures, and period-specific typography (e.g., Cooper Black).  Nostalgic, warm, and familiar."
        }
    ];

    const styleEmbedData = styleEmbedSource.map(function(style) {
        const normalized = style.name.trim().replace(/\s+/g, '-');
        const slug = normalized.toLowerCase();
        const theme = style.tone === '黑' ? 'dark' : 'light';
        return {
            name: normalized,
            slug: slug,
            category: `${style.tone === '黑' ? 'Dark' : 'Light'} UI`,
            url: `https://www.designprompts.dev/${slug}`,
            theme: theme,
            themeLabel: theme === 'dark' ? 'Dark UI' : 'Light UI',
            prompt: style.prompt // Pass the prompt data
        };
    });
    initStyleEmbeds(styleEmbedData);

    function initPromptFramework(data) {
        const categoryListEl = document.getElementById('prompt-category-list');
        const titleEl = document.getElementById('prompt-category-title');
        const descEl = document.getElementById('prompt-category-desc');
        const highlightsEl = document.getElementById('prompt-category-highlights');
        const modulesEl = document.getElementById('prompt-module-list');
        const layoutBadgeEl = document.getElementById('prompt-category-layout');
        const collectionListEl = document.getElementById('prompt-collection-list');

        if (!categoryListEl || !titleEl || !descEl) return;

        const categories = Array.isArray(data?.categories) ? data.categories : [];
        const collections = Array.isArray(data?.collections) ? data.collections : [];
        const layoutLabels = {
            'hero-centered': '居中主视觉',
            'stacked': '分层堆叠',
            'swatches': '色卡展示',
            'cards': '卡片叠层',
            'modules': '模块化',
            'type-mix': '混合排版',
            'timeline': '叙事轴',
            'overlay': '叠色覆盖'
        };
        let activeCategoryId = categories.length ? categories[0].id : null;

        const renderPlaceholder = function(targetEl, text) {
            targetEl.innerHTML = '';
            const placeholder = document.createElement('div');
            placeholder.className = 'framework-placeholder';
            placeholder.textContent = text;
            targetEl.appendChild(placeholder);
        };

        const selectCategory = function(categoryId) {
            const category = categories.find(function(cat) { return cat.id === categoryId; });
            if (!category) {
                titleEl.textContent = '暂无分类';
                descEl.textContent = '请先添加分类数据。';
                layoutBadgeEl.textContent = '--';
                renderPlaceholder(highlightsEl, '等待分类信息');
                renderPlaceholder(modulesEl, '等待模块数据');
                return;
            }

            activeCategoryId = categoryId;
            titleEl.textContent = category.name;
            descEl.textContent = category.description || '该分类暂无描述。';
            layoutBadgeEl.textContent = layoutLabels[category.layout] || '模块';

            // 更新激活态
            const buttons = categoryListEl.querySelectorAll('.framework-category');
            buttons.forEach(function(btn) {
                if (btn.dataset.category === categoryId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            highlightsEl.innerHTML = '';
            if (Array.isArray(category.highlights) && category.highlights.length) {
                category.highlights.forEach(function(item) {
                    const chip = document.createElement('span');
                    chip.className = 'highlight-chip';
                    chip.textContent = item;
                    highlightsEl.appendChild(chip);
                });
            } else {
                renderPlaceholder(highlightsEl, '暂无高亮信息');
            }

            modulesEl.innerHTML = '';
            if (Array.isArray(category.modules) && category.modules.length) {
                category.modules.forEach(function(module) {
                    const card = document.createElement('article');
                    card.className = 'module-card';
                    const title = document.createElement('h4');
                    title.textContent = module.title || '未命名模块';
                    card.appendChild(title);

                    if (Array.isArray(module.items) && module.items.length) {
                        const list = document.createElement('ul');
                        module.items.forEach(function(item) {
                            const li = document.createElement('li');
                            li.textContent = item;
                            list.appendChild(li);
                        });
                        card.appendChild(list);
                    } else {
                        const empty = document.createElement('p');
                        empty.className = 'panel-description';
                        empty.textContent = '暂无详细条目';
                        card.appendChild(empty);
                    }

                    modulesEl.appendChild(card);
                });
            } else {
                renderPlaceholder(modulesEl, '该分类暂未设置模块');
            }
        };

        const renderCategoryList = function() {
            categoryListEl.innerHTML = '';
            if (!categories.length) {
                renderPlaceholder(categoryListEl, '等待分类数据');
                return;
            }

            categories.forEach(function(category) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'framework-category';
                button.dataset.category = category.id;

                const title = document.createElement('h4');
                title.textContent = category.name;
                button.appendChild(title);

                const desc = document.createElement('p');
                if (Array.isArray(category.highlights) && category.highlights.length) {
                    desc.textContent = category.highlights.slice(0, 2).join(' · ');
                } else {
                    desc.textContent = category.description || '暂无描述';
                }
                button.appendChild(desc);

                button.addEventListener('click', function() {
                    selectCategory(category.id);
                });

                categoryListEl.appendChild(button);
            });
        };

        const renderCollections = function() {
            if (!collectionListEl) return;
            collectionListEl.innerHTML = '';

            if (!collections.length) {
                renderPlaceholder(collectionListEl, '尚未创建套件');
                return;
            }

            collections.forEach(function(collection) {
                const card = document.createElement('article');
                card.className = 'collection-card';

                const header = document.createElement('header');
                const title = document.createElement('h4');
                title.textContent = collection.title;
                header.appendChild(title);

                if (collection.summary) {
                    const summary = document.createElement('p');
                    summary.textContent = collection.summary;
                    header.appendChild(summary);
                }

                card.appendChild(header);

                if (Array.isArray(collection.categoryRefs) && collection.categoryRefs.length) {
                    const tags = document.createElement('div');
                    tags.className = 'collection-tags';
                    collection.categoryRefs.forEach(function(ref) {
                        const category = categories.find(function(cat) { return cat.id === ref; });
                        const tag = document.createElement('span');
                        tag.className = 'collection-tag';
                        tag.textContent = category ? category.name : ref;
                        tags.appendChild(tag);
                    });
                    card.appendChild(tags);
                }

                if (Array.isArray(collection.pillars) && collection.pillars.length) {
                    const pillarsWrap = document.createElement('div');
                    pillarsWrap.className = 'collection-pillars';
                    collection.pillars.forEach(function(pillar) {
                        const pillarCard = document.createElement('div');
                        pillarCard.className = 'pillar';

                        const label = document.createElement('p');
                        label.className = 'pillar-label';
                        label.textContent = pillar.label || 'Pillar';
                        pillarCard.appendChild(label);

                        if (Array.isArray(pillar.items) && pillar.items.length) {
                            const list = document.createElement('ul');
                            pillar.items.forEach(function(item) {
                                const li = document.createElement('li');
                                li.textContent = item;
                                list.appendChild(li);
                            });
                            pillarCard.appendChild(list);
                        }

                        pillarsWrap.appendChild(pillarCard);
                    });
                    card.appendChild(pillarsWrap);
                }

                if (Array.isArray(collection.prompt) && collection.prompt.length) {
                    const snippet = document.createElement('div');
                    snippet.className = 'prompt-snippet';
                    const list = document.createElement('ul');
                    collection.prompt.forEach(function(line) {
                        const li = document.createElement('li');
                        li.textContent = line;
                        list.appendChild(li);
                    });
                    snippet.appendChild(list);
                    card.appendChild(snippet);
                }

                collectionListEl.appendChild(card);
            });
        };

        renderCategoryList();
        if (activeCategoryId) {
            selectCategory(activeCategoryId);
        }
        renderCollections();
    }

    function initToolShortcuts(data) {
        const grid = document.getElementById('quick-launch-grid');
        const updatedEl = document.getElementById('tool-meta-updated');
        const countEl = document.getElementById('tool-meta-count');

        if (!grid || !updatedEl || !countEl) return;

        const tools = Array.isArray(data?.tools) ? data.tools : [];
        updatedEl.textContent = data?.updated || '--';
        countEl.textContent = tools.length || 0;

        grid.innerHTML = '';
        if (!tools.length) {
            const placeholder = document.createElement('div');
            placeholder.className = 'framework-placeholder';
            placeholder.textContent = '尚未配置快捷软件';
            grid.appendChild(placeholder);
            return;
        }

        tools.forEach(function(tool) {
            const card = document.createElement('article');
            card.className = 'tool-card';

            const header = document.createElement('header');
            const name = document.createElement('h4');
            name.className = 'tool-name';
            name.textContent = tool.name || '未命名工具';
            header.appendChild(name);

            if (tool.shortcut) {
                const shortcut = document.createElement('span');
                shortcut.className = 'tool-shortcut';
                shortcut.textContent = tool.shortcut;
                header.appendChild(shortcut);
            }

            card.appendChild(header);

            if (tool.description) {
                const desc = document.createElement('p');
                desc.className = 'tool-desc';
                desc.textContent = tool.description;
                card.appendChild(desc);
            }

            if (Array.isArray(tool.tags) && tool.tags.length) {
                const tags = document.createElement('div');
                tags.className = 'tool-tags';
                tool.tags.forEach(function(tagItem) {
                    const tag = document.createElement('span');
                    tag.className = 'tool-tag';
                    tag.textContent = tagItem;
                    tags.appendChild(tag);
                });
                card.appendChild(tags);
            }

            if (tool.notes) {
                const notes = document.createElement('p');
                notes.className = 'tool-notes';
                notes.textContent = tool.notes;
                card.appendChild(notes);
            }

            const launchBtn = document.createElement('button');
            launchBtn.className = 'tool-launch-btn';
            launchBtn.type = 'button';
            launchBtn.textContent = '打开';
            if (tool.url) {
                launchBtn.dataset.url = tool.url;
                launchBtn.addEventListener('click', function() {
                    const link = this.dataset.url;
                    if (!link) return;
                    window.open(link, '_blank', 'noopener');
                });
            } else {
                launchBtn.disabled = true;
                launchBtn.textContent = '未配置链接';
                launchBtn.style.opacity = '0.5';
                launchBtn.style.cursor = 'not-allowed';
            }

            card.appendChild(launchBtn);
            grid.appendChild(card);
        });
    }

    function initStyleEmbeds(styles) {
        const grid = document.getElementById('style-embed-grid');
        if (!grid) return;

        grid.innerHTML = '';

        if (!Array.isArray(styles) || !styles.length) {
            const placeholder = document.createElement('div');
            placeholder.className = 'framework-placeholder';
            placeholder.textContent = '等待添加外部风格链接';
            grid.appendChild(placeholder);
            return;
        }

        styles.forEach(function(style, index) {
            const card = document.createElement('article');
            card.className = 'style-embed-card';

            const frame = document.createElement('div');
            frame.className = 'style-embed-frame';

            const iframe = document.createElement('iframe');
            iframe.loading = 'lazy';
            iframe.title = `${style.name} 风格预览`;
            iframe.src = style.url;
            iframe.setAttribute('aria-hidden', 'true');
            iframe.tabIndex = -1;
            const scale = typeof style.scale === 'number' ? style.scale : 0.16;
            const viewportWidth = style.viewportWidth || 1440;
            const viewportHeight = style.viewportHeight || 1024;
            iframe.style.width = `${viewportWidth}px`;
            iframe.style.height = `${viewportHeight}px`;
            iframe.style.transform = `scale(${scale})`;
            frame.appendChild(iframe);

            card.appendChild(frame);

            const meta = document.createElement('div');
            meta.className = 'style-embed-meta';

            const info = document.createElement('div');
            const title = document.createElement('h4');
            title.className = 'style-embed-title';
            title.textContent = style.name || '未命名风格';
            info.appendChild(title);

            const themeText = document.createElement('p');
            themeText.className = 'style-theme-label';
            themeText.textContent = style.themeLabel || (style.theme === 'dark' ? 'Dark UI' : 'Light UI');
            info.appendChild(themeText);

            meta.appendChild(info);

            const actions = document.createElement('div');
            actions.className = 'style-embed-actions';
            actions.style.display = 'flex';
            actions.style.gap = '8px';
            actions.style.alignItems = 'center';
            actions.style.marginTop = 'auto'; // Push to bottom if flex column, but here it's row

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
                复制提示词
            `;
            copyBtn.style.display = 'inline-flex';
            copyBtn.style.alignItems = 'center';
            copyBtn.style.gap = '6px';
            copyBtn.title = '复制 AI 提示词';
            
            copyBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const textToCopy = style.prompt;
                if (!textToCopy) {
                    console.warn('No prompt found for style:', style.name);
                    return;
                }

                const showSuccess = () => {
                    const originalHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
                复制提示词
            `;
                    copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        已复制
                    `;
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                };

                // 尝试使用 Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        showSuccess();
                        return;
                    } catch (err) {
                        console.error('Clipboard API failed, trying fallback:', err);
                    }
                }

                // Fallback: 使用临时 textarea
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    
                    // 确保 textarea 不可见但存在于文档流中
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    textArea.style.top = '0';
                    document.body.appendChild(textArea);
                    
                    textArea.focus();
                    textArea.select();
                    
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    if (successful) {
                        showSuccess();
                    } else {
                        console.error('Fallback copy failed');
                        alert('复制失败，请尝试手动复制');
                    }
                } catch (err) {
                    console.error('Fallback error:', err);
                    alert('复制出错: ' + err);
                }
            };

            actions.appendChild(copyBtn);

            const openLink = document.createElement('a');
            openLink.className = 'style-embed-link';
            openLink.href = style.url;
            openLink.target = '_blank';
            openLink.rel = 'noopener noreferrer';
            openLink.textContent = '打开模板';
            actions.appendChild(openLink);

            meta.appendChild(actions);

            card.appendChild(meta);

            grid.appendChild(card);

            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });

            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            const groupIndex = Math.floor(index / 4);
            const delay = groupIndex * 0.1;
            card.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
            observer.observe(card);
        });

        setupFloatingInteraction(styles);
    }

    function setupFloatingInteraction(styles) {
        const bar = document.getElementById('floating-prompt-bar');
        const modal = document.getElementById('prompt-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalPrompt = document.getElementById('modal-prompt-text');
        const modalThemeBadge = document.getElementById('modal-theme-badge');
        const modalCharCount = document.getElementById('modal-char-count');
        const modalCopyBtn = document.getElementById('modal-copy-btn');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        if (!bar || !modal) return;

        let currentStyle = null;

        // Render Floating Bar content
        const renderBar = (style) => {
            bar.innerHTML = `
                <a href="/" class="fpb-home-link" title="Back to home">
                    <span class="fpb-logo-text">design<span style="color: rgb(245, 158, 11);">/</span>prompts</span>
                </a>
                <div class="fpb-divider"></div>
                <div class="fpb-style-info">
                    <div class="fpb-dot"></div>
                    <span class="fpb-style-name">${style.name}</span>
                </div>
                <div class="fpb-divider"></div>
                <button class="fpb-btn" id="fpb-prompt-btn" type="button" title="Get the AI prompt for this design">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                    <span>Prompt</span>
                </button>
                <a href="${style.url}" target="_blank" class="fpb-btn" title="Browse all design styles">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
                    </svg>
                    <span>Styles</span>
                </a>
            `;

            const promptBtn = bar.querySelector('#fpb-prompt-btn');
            promptBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(style);
            };
        };

        const openModal = (style) => {
            currentStyle = style;
            modalTitle.textContent = style.name;
            
            // Generate a better description if none exists
            if (style.description) {
                modalDesc.textContent = style.description;
            } else {
                modalDesc.textContent = `A professional ${style.theme} mode design style with ${style.tone === '黑' ? 'dark' : 'light'} aesthetics. Perfect for modern applications requiring a ${style.slug} look and feel.`;
            }

            modalPrompt.textContent = style.prompt;
            
            // Update Theme Badge
            if (modalThemeBadge) {
                const isDark = style.theme === 'dark';
                const iconColor = isDark ? 'text-violet-400' : 'text-amber-400';
                const iconSvg = isDark 
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon h-3.5 w-3.5 ${iconColor}"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-3.5 w-3.5 ${iconColor}"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41-1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
                
                modalThemeBadge.innerHTML = `
                    ${iconSvg}
                    <span class="font-medium text-white/70 text-xs">${isDark ? 'Dark Mode' : 'Light Mode'}</span>
                `;
            }

            // Update Char Count
            if (modalCharCount) {
                const count = style.prompt ? style.prompt.length : 0;
                modalCharCount.textContent = `${count.toLocaleString()} characters`;
            }
            
            // Reset Copy Button
            modalCopyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                Copy Prompt
            `;
            modalCopyBtn.classList.remove('copied');
            modalCopyBtn.style.background = '';

            modal.classList.remove('hidden');
            // Force reflow
            void modal.offsetWidth;
            modal.classList.add('active');
        };

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
        };

        modalCloseBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });

        modalCopyBtn.onclick = async () => {
            const promptText = modalPrompt.textContent;
            if (!promptText) return;

            try {
                await navigator.clipboard.writeText(promptText);
                const originalContent = modalCopyBtn.innerHTML;
                modalCopyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check h-4 w-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Copied!
                `;
                modalCopyBtn.classList.add('copied');
                modalCopyBtn.style.background = '#16a34a';

                setTimeout(() => {
                    modalCopyBtn.innerHTML = originalContent;
                    modalCopyBtn.classList.remove('copied');
                    modalCopyBtn.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Copy failed', err);
            }
        };

        // Attach interactions to cards
        const cards = document.querySelectorAll('.style-embed-card');
        cards.forEach((card, index) => {
            const style = styles[index];
            card.addEventListener('click', (e) => {
                // If user clicks the card (anywhere except existing buttons), show/update bar
                // Check if click target is not a button or link
                if (e.target.closest('button') || e.target.closest('a')) return;
                
                renderBar(style);
                bar.classList.add('active');
            });

            // Also support hover for quick preview?
            // User said "Clicking... pops up layer". 
            // If I use hover, it might be annoying if bar is far away.
            // Let's stick to click to activate the bar.
            // But wait, if I click the card, does it scroll to the bar? No, bar is fixed.
            // It just appears.
        });

        // Hide bar when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.style-embed-card') && !e.target.closest('.floating-prompt-bar')) {
                bar.classList.remove('active');
            }
        });
    }

});
