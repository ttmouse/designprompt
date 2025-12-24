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
            prompt: `color-palette:
  #000000: "Primary, Text, Borders"
  #FFFFFF: "Background, Negative Space"
  #F5F5F5: "Subtle Backgrounds"

typography:
  font-family: "Inter, sans-serif"
  headers: "Bold, Uppercase, Tight Tracking"
  body: "Regular, High Line Height"

layout:
  grid: "12-column, fluid"
  spacing: "Generous, airy"
  borders: "1px solid #000000"

components:
  buttons: "Square corners, 1px border, hover: invert colors"
  cards: "No shadow, 1px border, padding: 24px"
  inputs: "Underline only, no background"

style-guide:
  - "Use pure black and white only"
  - "Emphasize negative space"
  - "Use lines and borders to separate content"
  - "Avoid drop shadows and gradients"`
        },
        { 
            name: 'Bauhaus', 
            tone: '白',
            prompt: `color-palette:
  #FF0000: "Bauhaus Red"
  #0000FF: "Bauhaus Blue"
  #FFFF00: "Bauhaus Yellow"
  #1A1A1A: "Structure, Text"
  #F0F0F0: "Background"

typography:
  font-family: "Geometric Sans-Serif (e.g., Futura, Herbert Bayer)"
  headers: "All lowercase or geometric uppercase"
  body: "Clean, functional, legible"

layout:
  grid: "Diagonal, asymmetrical, modular"
  shapes: "Circles, squares, triangles"
  composition: "Dynamic balance over symmetry"

components:
  buttons: "Circular or perfectly square, primary colors"
  cards: "Thick borders, geometric overlays"
  navigation: "Minimal, structural"

style-guide:
  - "Form follows function"
  - "Use primary colors boldly"
  - "Integrate geometric primitives"
  - "Avoid decorative ornamentation"`
        },
        { 
            name: 'Modern Dark', 
            tone: '黑',
            prompt: `color-palette:
  #0F172A: "Background (Slate 900)"
  #1E293B: "Surface (Slate 800)"
  #38BDF8: "Primary Accent (Sky 400)"
  #94A3B8: "Secondary Text (Slate 400)"
  #F8FAFC: "Primary Text (Slate 50)"

typography:
  font-family: "Inter, Roboto, system-ui"
  headers: "Semi-bold, clean, readable"
  body: "Regular, good contrast"

layout:
  grid: "Responsive, 8pt grid system"
  spacing: "Comfortable, consistent"
  depth: "Subtle layers using lightness"

components:
  buttons: "Rounded corners (8px), subtle gradients"
  cards: "Surface color, 1px border (white/10%), soft shadow"
  inputs: "Darker background, focus ring"

style-guide:
  - "Ensure high contrast for accessibility"
  - "Use borders to define hierarchy (1px solid white/5%)"
  - "Limit accent color usage to key actions"
  - "Avoid pure black (#000000) for backgrounds"`
        },
        { 
            name: 'Newsprint', 
            tone: '白',
            prompt: `color-palette:
  #FDFBF7: "Paper Background (Off-white)"
  #1A1A1A: "Ink Black"
  #CC0000: "Editorial Red (Accents)"
  #E5E5E5: "Dividers"

typography:
  font-family: "Merriweather, Playfair Display (Serif)"
  headers: "Large, Condensed, High Contrast"
  body: "Serif, justified, multi-column"

layout:
  grid: "Multi-column, dense, modular"
  dividers: "Hairline vertical and horizontal rules"
  spacing: "Tight, information-dense"

components:
  buttons: "Text-only or bordered rectangles"
  images: "Grayscale or high-contrast halftone"
  tags: "Uppercase, small, bordered"

style-guide:
  - "Mimic traditional newspaper layout"
  - "Use serifs for both headings and body"
  - "Justify text where appropriate"
  - "Use lines to separate stories/sections"`
        },
        { 
            name: 'SaaS', 
            tone: '白',
            prompt: `color-palette:
  #FFFFFF: "Background"
  #3B82F6: "Primary Blue"
  #111827: "Text Primary"
  #6B7280: "Text Secondary"
  #F3F4F6: "Background Secondary"

typography:
  font-family: "Inter, Proxima Nova, sans-serif"
  headers: "Bold, Friendly, clear hierarchy"
  body: "Regular, 16px base size"

layout:
  grid: "Container-based, centered"
  spacing: "Whitespace-heavy"
  sections: "Alternating background colors"

components:
  buttons: "Pill-shaped or rounded-md, flat color"
  cards: "White, heavy drop-shadow (shadow-lg), rounded-xl"
  hero: "Left-aligned text, right-aligned illustration"

style-guide:
  - "Prioritize clarity and conversion"
  - "Use friendly, rounded shapes"
  - "Consistent iconography (Outline or Solid)"
  - "Clear Call-to-Actions (CTAs)"`
        },
        { 
            name: 'Luxury', 
            tone: '白',
            prompt: `color-palette:
  #0A0A0A: "Primary Text/Background"
  #F4F1EA: "Cream/Paper"
  #D4AF37: "Gold Foil/Accent"
  #808080: "Silver/Muted"

typography:
  font-family: "Didot, Bodoni, Cinzel (High-contrast Serif)"
  headers: "Elegant, tracked-out (letter-spacing)"
  body: "Light weight sans-serif or refined serif"

layout:
  grid: "Asymmetrical, artistic"
  spacing: "Extensive negative space"
  images: "Full-bleed, high-quality photography"

components:
  buttons: "Ghost buttons, thin borders, uppercase"
  navigation: "Minimal, hamburger menu or centered logo"
  dividers: "Short, centered lines"

style-guide:
  - "Less is more"
  - "Focus on typography and imagery"
  - "Use metallic tones sparingly"
  - "Create a sense of exclusivity"`
        },
        { 
            name: 'Terminal', 
            tone: '黑',
            prompt: `color-palette:
  #000000: "CRT Black"
  #00FF00: "Phosphor Green"
  #333333: "Dimmed Text"
  #003300: "Scanline/Background Tint"

typography:
  font-family: "Courier New, Fira Code, monospace"
  headers: "Uppercase, ASCII Art styles"
  body: "Monospaced, fixed width"

layout:
  grid: "Single column, top-down flow"
  borders: "Block characters (█ ▓ ▒ ░)"
  spacing: "Line-height based"

components:
  input: "Blinking cursor (_ or █)"
  buttons: "[ BUTTON ] style text"
  loaders: "Progress bars [||||||....]"

style-guide:
  - "Simulate command-line interface"
  - "Use green on black exclusively"
  - "No images, only ASCII art"
  - "Raw, brutalist, developer-focused"`
        },
        { 
            name: 'Swiss Minimalist', 
            tone: '白',
            prompt: `color-palette:
  #FFFFFF: "Canvas"
  #000000: "Ink"
  #FF3333: "Accent (Swiss Red)"
  #EEEEEE: "Grid Lines (optional)"

typography:
  font-family: "Helvetica Now, Akzidenz-Grotesk"
  headers: "Bold, tight layout, varying scales"
  body: "Left-aligned, ragged right"

layout:
  grid: "Strict modular grid"
  alignment: "Flush left"
  spacing: "Mathematical, consistent"

components:
  images: "Black and white photography, cropped"
  buttons: "Simple text links or solid blocks"
  graphics: "Abstract geometric shapes"

style-guide:
  - "Objective photography and text"
  - "Asymmetrical organization"
  - "Use of a mathematically constructed grid"
  - "Sans-serif typography is mandatory"`
        },
        { 
            name: 'Kinetic', 
            tone: '黑',
            prompt: `color-palette:
  #000000: "Background"
  #CCFF00: "Volt / Lime"
  #FF00FF: "Magenta"
  #FFFFFF: "Text"

typography:
  font-family: "Monument Extended, Druk Wide"
  headers: "Massive, Italic, Outlined"
  body: "Bold sans-serif"

layout:
  grid: "Broken grid, overlapping"
  motion: "Marquee scrolls, parallax"
  spacing: "Dynamic"

components:
  ticker: "Infinite scrolling text bands"
  images: "Cut-outs, collages, motion blurred"
  cursor: "Custom large cursor"

style-guide:
  - "High energy and movement"
  - "Bold, wide typography"
  - "High contrast neon colors"
  - "Feels fast and loud"`
        },
        { 
            name: 'Flat Design', 
            tone: '白',
            prompt: `color-palette:
  #2ECC71: "Emerald"
  #3498DB: "Peter River"
  #E74C3C: "Alizarin"
  #F1C40F: "Sun Flower"
  #ECF0F1: "Clouds (Background)"
  #2C3E50: "Midnight Blue (Text)"

typography:
  font-family: "Open Sans, Lato, Montserrat"
  headers: "Bold, Uppercase"
  body: "Regular, readable"

layout:
  grid: "Simple, block-based"
  spacing: "Comfortable"
  depth: "None (completely 2D)"

components:
  icons: "Solid color, simple shapes"
  buttons: "Rectangular, solid color, no gradient"
  illustrations: "Vector, unshaded"

style-guide:
  - "No gradients, shadows, or textures"
  - "Focus on color and typography"
  - "Simple, user-centric interface"
  - "Fast loading, vector-based assets"`
        },
        { 
            name: 'Art Deco', 
            tone: '黑',
            prompt: `color-palette:
  #1A1A1A: "Midnight Black"
  #D4AF37: "Gold Metallic"
  #004225: "Emerald Green"
  #FFFDD0: "Cream"

typography:
  font-family: "Marcellus, Poiret One, Righteous"
  headers: "Decorative, Geometric"
  body: "Elegant sans-serif"

layout:
  grid: "Symmetrical, centered"
  borders: "Ornate frames, zig-zags"
  spacing: "Structured"

components:
  dividers: "Sunbursts, fans, geometric lines"
  buttons: "Bordered with corner decorations"
  backgrounds: "Repeating geometric patterns"

style-guide:
  - "Luxury, glamour, and exuberance"
  - "Geometric shapes (triangles, chevrons)"
  - "Metallic accents (gold, brass, chrome)"
  - "Vertical emphasis"`
        },
        { 
            name: 'Material Design', 
            tone: '白',
            prompt: `color-palette:
  #6200EE: "Primary (Purple 500)"
  #03DAC6: "Secondary (Teal 200)"
  #FFFFFF: "Surface"
  #B00020: "Error"
  #000000: "On Surface (High Emphasis)"

typography:
  font-family: "Roboto, Noto Sans"
  headers: "Regular, various weights (H1-H6)"
  body: "Regular, 16sp"

layout:
  grid: "Responsive layout grid (4/8/12 columns)"
  spacing: "8dp baseline grid"
  elevation: "Shadows indicate hierarchy (z-axis)"

components:
  fab: "Floating Action Button (Circular)"
  cards: "Elevated surfaces with rounded corners (4dp)"
  ripples: "Ink ripple interaction effect"

style-guide:
  - "Mimic physical paper and ink"
  - "Use shadows to convey depth and order"
  - "Bold, graphic, intentional imagery"
  - "Motion provides meaning"`
        },
        { 
            name: 'Neo Brutalism', 
            tone: '白',
            prompt: `color-palette:
  #FFDD00: "Yellow"
  #FF4D4D: "Red"
  #4D79FF: "Blue"
  #FFFFFF: "Background"
  #000000: "Strokes & Text"

typography:
  font-family: "Courier, Arial, Unconventional fonts"
  headers: "System fonts, bold, raw"
  body: "System fonts, high contrast"

layout:
  grid: "Rigid, visible borders"
  spacing: "Inconsistent or exaggerated"
  alignment: "Often ignored or intentionally off"

components:
  buttons: "Hard shadows (offset), thick borders"
  cards: "No border radius, thick black strokes"
  images: "Raw, unedited, or dithered"

style-guide:
  - "Raw, unpolished aesthetic"
  - "High contrast colors and strokes"
  - "Default system fonts"
  - "Reaction against 'clean' design"`
        },
        { 
            name: 'Bold Typography', 
            tone: '黑',
            prompt: `color-palette:
  #000000: "Background"
  #FFFFFF: "Text"
  #FF3366: "Accent (optional)"

typography:
  font-family: "Impact, Anton, Custom Display"
  headers: "Extremely Large (10vw+)"
  body: "Small, supporting role only"

layout:
  grid: "Text-driven, breaks boundaries"
  spacing: "Tight leading, negative tracking"
  alignment: "Justified or Centered"

components:
  headings: "Act as the main visual element"
  navigation: "Oversized menu items"
  interactions: "Text color changes on hover"

style-guide:
  - "Type IS the image"
  - "Maximize contrast and scale"
  - "Minimalist approach to other elements"
  - "Short, punchy copy"`
        },
        { 
            name: 'Academia', 
            tone: '白',
            prompt: `color-palette:
  #F5F5DC: "Beige / Parchment"
  #2F4F4F: "Dark Slate Gray"
  #8B4513: "Saddle Brown"
  #556B2F: "Dark Olive Green"

typography:
  font-family: "Garamond, Crimson Text, Serif"
  headers: "Traditional Serif, Italic accents"
  body: "Readable Serif"

layout:
  grid: "Traditional, book-like"
  margins: "Wide"
  columns: "Single or dual column text"

components:
  borders: "Double lines, corner ornaments"
  images: "Sepia tone, engravings, diagrams"
  icons: "Quill, book, spectacles style"

style-guide:
  - "Intellectual, historical feel"
  - "Warm, earthy textures"
  - "Respect for traditional typesetting"
  - "Calm and focused"`
        },
        { 
            name: 'Cyberpunk', 
            tone: '黑',
            prompt: `color-palette:
  #050505: "Void Black"
  #00FFFF: "Cyan / Electric Blue"
  #FF0099: "Neon Pink"
  #FFFF00: "Hazard Yellow"

typography:
  font-family: "Orbitron, Rajdhani, Glitch fonts"
  headers: "Tech-inspired, angular"
  body: "Clean tech sans"

layout:
  grid: "Chaotic, layered, HUD-style"
  decorations: "Circuit lines, hex patterns"
  overlays: "Scanlines, noise"

components:
  buttons: "Angled corners (clip-path), glowing borders"
  panels: "Semi-transparent glass, data overlays"
  glitch: "CSS clip-path animations"

style-guide:
  - "High tech, low life"
  - "Neon lights in darkness"
  - "Glitch effects and distortion"
  - "Japanese cyberpunk influences"`
        },
        { 
            name: 'Web3', 
            tone: '黑',
            prompt: `color-palette:
  #0D0D15: "Deep Space"
  #6D28D9: "Violet"
  #EC4899: "Pink"
  #3B82F6: "Blue"

typography:
  font-family: "Inter, Space Grotesk"
  headers: "Modern, Gradient Text"
  body: "Clean, high readability"

layout:
  grid: "Fluid, floating elements"
  backgrounds: "Mesh gradients, blurred orbs"
  depth: "Glassmorphism layers"

components:
  cards: "Glass effect (backdrop-filter), border gradients"
  buttons: "Gradient backgrounds, glow effects"
  3d: "Abstract 3D shapes/splines"

style-guide:
  - "Futuristic and decentralized"
  - "Dark mode with vibrant gradients"
  - "Glassmorphism and transparency"
  - "Abstract, ethereal visuals"`
        },
        { 
            name: 'Playful Geometric', 
            tone: '白',
            prompt: `color-palette:
  #FF6B6B: "Pastel Red"
  #4ECDC4: "Pastel Teal"
  #FFE66D: "Pastel Yellow"
  #FFFFFF: "Background"
  #292929: "Text"

typography:
  font-family: "Quicksand, Fredoka One, Rounded Sans"
  headers: "Rounded, friendly"
  body: "Simple sans-serif"

layout:
  grid: "Loose, scattered"
  shapes: "Organic blobs, squiggles, confetti"
  spacing: "Open"

components:
  buttons: "Fully rounded (Pill), bouncy hover"
  cards: "Rounded large radius (24px+)"
  illustrations: "Flat, simple geometric characters"

style-guide:
  - "Fun, friendly, and approachable"
  - "Bright, happy colors"
  - "Rounded corners everywhere"
  - "Sense of movement and joy"`
        },
        { 
            name: 'Minimal Dark', 
            tone: '黑',
            prompt: `color-palette:
  #000000: "True Black"
  #111111: "Off Black (Surface)"
  #FFFFFF: "Text High Emphasis"
  #888888: "Text Medium Emphasis"

typography:
  font-family: "Inter, San Francisco, System"
  headers: "Regular weight, tracking normal"
  body: "Light/Regular weight"

layout:
  grid: "Centered, focused"
  spacing: "Extensive black space"
  distractions: "Zero"

components:
  buttons: "White outline or simple text"
  cards: "Subtle separation (1px solid #333)"
  images: "High quality, cinematic"

style-guide:
  - "Content is king"
  - "Remove all non-essential elements"
  - "Strict monochromatic palette"
  - "Sophisticated and premium"`
        },
        { 
            name: 'Claymorphism', 
            tone: '白',
            prompt: `color-palette:
  #E0E5EC: "Background (Light Gray)"
  #FFFFFF: "Highlight"
  #A3B1C6: "Shadow"
  #FFADAD: "Pastel Accent"

typography:
  font-family: "Nunito, Poppins, Rounded"
  headers: "Soft, rounded"
  body: "Readable, dark gray"

layout:
  grid: "Card-based, floating"
  spacing: "Separated elements"
  depth: "High (3D feel)"

components:
  cards: "Inflated look, inner shadow + drop shadow"
  buttons: "Pill shape, floating, soft press effect"
  shapes: "3D rendered style, matte finish"

style-guide:
  - "Friendly, 3D 'clay' aesthetic"
  - "Soft shadows and rounded corners"
  - "Pastel and airy colors"
  - "Tactile, touchable feel"`
        },
        { 
            name: 'Professional', 
            tone: '白',
            prompt: `color-palette:
  #003366: "Navy Blue (Trust)"
  #FFFFFF: "White"
  #F4F4F4: "Light Gray"
  #333333: "Dark Gray (Text)"

typography:
  font-family: "Arial, Helvetica, Roboto"
  headers: "Bold, Standard"
  body: "Regular, Legible"

layout:
  grid: "Standard 12-column, Bootstrap-style"
  sections: "Clear delineation"
  alignment: "Left or Center"

components:
  navbar: "Top fixed, clear branding"
  buttons: "Rectangular, slight radius (4px), blue"
  forms: "Standard inputs, clear labels"

style-guide:
  - "Reliable, stable, corporate"
  - "Safe color choices (Blues, Greys)"
  - "Standard UX patterns"
  - "Focus on information delivery"`
        },
        { 
            name: 'Botanical', 
            tone: '白',
            prompt: `color-palette:
  #F7F9F4: "Off-white / Paper"
  #2D4A3E: "Forest Green"
  #8FBC8F: "Sage Green"
  #8B4513: "Earth Brown"

typography:
  font-family: "Cormorant Garamond, DM Serif Display"
  headers: "Elegant Serif"
  body: "Clean Sans or Serif"

layout:
  grid: "Organic, airy"
  decorations: "Leaf patterns, vines"
  textures: "Paper grain, watercolor"

components:
  buttons: "Rounded, earth tones"
  images: "Framed with organic shapes"
  dividers: "Floral motifs"

style-guide:
  - "Natural, organic, sustainable"
  - "Muted, earthy color palette"
  - "Use of plant imagery and textures"
  - "Calm and restorative"`
        },
        { 
            name: 'Vaporwave', 
            tone: '黑',
            prompt: `color-palette:
  #FF71CE: "Hot Pink"
  #01CDFE: "Cyan"
  #05FFA1: "Neon Green"
  #B967FF: "Purple"
  #FFFB96: "Yellow"

typography:
  font-family: "VCR OSD Mono, Alien Encounters"
  headers: "Glitchy, Retro"
  body: "Pixelated or Sans"

layout:
  grid: "Collage, broken"
  elements: "Windows 95 UI, Marble busts"
  backgrounds: "Grid lines, sunsets"

components:
  windows: "Beveled edges, gray backgrounds"
  buttons: "Retro 3D style"
  graphics: "Palm trees, dolphins, geometry"

style-guide:
  - "Aesthetics over function"
  - "Nostalgia for 80s/90s tech"
  - "Surrealism and irony"
  - "Lo-fi digital artifacts"`
        },
        { 
            name: 'Enterprise', 
            tone: '白',
            prompt: `color-palette:
  #F1F5F9: "Background (Slate 100)"
  #FFFFFF: "Panel Background"
  #0F172A: "Text (Slate 900)"
  #3B82F6: "Action (Blue 500)"

typography:
  font-family: "Inter, System UI"
  headers: "Small, Bold, Uppercase (Labels)"
  body: "Small (13px/14px), Data-dense"

layout:
  grid: "Dashboard, Sidebar + Main Content"
  density: "High"
  panels: "Resizable, modular"

components:
  tables: "Striped, sortable, dense"
  charts: "Data visualization"
  sidebar: "Collapsible navigation"

style-guide:
  - "Maximize screen real estate"
  - "Data density is priority"
  - "Clear status indicators (Red/Green/Yellow)"
  - "Functional and efficient"`
        },
        { 
            name: 'Sketch', 
            tone: '白',
            prompt: `color-palette:
  #FFFFFF: "Paper"
  #2F2F2F: "Graphite / Pencil"
  #E0E0E0: "Eraser marks"
  #FFCC00: "Highlighter"

typography:
  font-family: "Patrick Hand, Architects Daughter"
  headers: "Handwritten, marker style"
  body: "Handwritten, legible"

layout:
  grid: "Loose, notebook style"
  lines: "Ruled paper background"
  borders: "Wobbly, hand-drawn"

components:
  arrows: "Hand-drawn pointers"
  circles: "Roughly circled elements"
  buttons: "Boxed doodles"

style-guide:
  - "Informal, creative, WIP feel"
  - "Hand-drawn imperfections"
  - "Monochrome with highlighter accents"
  - "Personal and authentic"`
        },
        { 
            name: 'Industrial', 
            tone: '白',
            prompt: `color-palette:
  #D3D3D3: "Concrete Gray"
  #FFD700: "Safety Yellow"
  #000000: "Black (Markings)"
  #FFFFFF: "White"

typography:
  font-family: "DIN, Roboto Mono, Saira"
  headers: "Technical, Stenciled"
  body: "Monospace, precise"

layout:
  grid: "Rigid, visible lines"
  spacing: "Measured"
  decorations: "Warning stripes, crosshairs"

components:
  labels: "Technical specs box"
  buttons: "Physical switches, rectangular"
  borders: "Thick, squared off"

style-guide:
  - "Function over form"
  - "Raw materials (concrete, steel)"
  - "Safety signage aesthetics"
  - "Robust and heavy"`
        },
        { 
            name: 'Neumorphism', 
            tone: '白',
            prompt: `color-palette:
  #E0E5EC: "Base Color (Light Gray)"
  #FFFFFF: "Highlight (Top-Left)"
  #A3B1C6: "Shadow (Bottom-Right)"
  #4D4D4D: "Text"

typography:
  font-family: "Nunito, Muli, Sans-serif"
  headers: "Soft, integrated"
  body: "Clean, low contrast"

layout:
  grid: "Spacious, soft"
  spacing: "Wide"
  surfaces: "Continuous, extruded"

components:
  buttons: "Soft convex shape (extruded)"
  inputs: "Soft concave shape (pressed)"
  toggles: "Realistic physical switches"

style-guide:
  - "Soft, extruded plastic look"
  - "Low contrast, monochromatic"
  - "Play with light and shadow"
  - "Modern, minimal, futuristic"`
        },
        { 
            name: 'Organic', 
            tone: '白',
            prompt: `color-palette:
  #FDF6E3: "Cream / Sand"
  #D2691E: "Terracotta"
  #556B2F: "Olive"
  #8B0000: "Deep Red (Accent)"

typography:
  font-family: "Lora, Recoleta, Organic Serif"
  headers: "Curvy, fluid"
  body: "Humanist Sans"

layout:
  grid: "Freeform, overlapping"
  shapes: "Blobs, waves, arches"
  alignment: "Asymmetrical"

components:
  buttons: "Pebble shapes"
  images: "Masked in organic shapes"
  backgrounds: "Subtle textures"

style-guide:
  - "Inspired by nature's forms"
  - "Warm, welcoming colors"
  - "Avoid straight lines and sharp corners"
  - "Flowing and human"`
        },
        { 
            name: 'Maximalism', 
            tone: '白',
            prompt: `color-palette:
  #FF0000: "Red"
  #00FF00: "Green"
  #0000FF: "Blue"
  #FFFF00: "Yellow"
  #FF00FF: "Magenta"

typography:
  font-family: "Mix of everything (Serif + Sans + Display)"
  headers: "Huge, layered, clashing"
  body: "Bold, fills space"

layout:
  grid: "Packed, chaotic, layered"
  spacing: "Zero / Negative"
  density: "Extreme"

components:
  collage: "Mixed media, cutouts"
  patterns: "Repeating textures, checks"
  borders: "Thick, decorative"

style-guide:
  - "More is more"
  - "Sensory overload"
  - "Clashing patterns and colors"
  - "Bold, confident, loud"`
        },
        { 
            name: 'Retro', 
            tone: '白',
            prompt: `color-palette:
  #EADDCD: "Aged Paper"
  #C0392B: "Retro Red"
  #E67E22: "Burnt Orange"
  #2C3E50: "Faded Blue"

typography:
  font-family: "Cooper Black, Lobster, Retro Script"
  headers: "Bulbous, swirly"
  body: "Typewriter style"

layout:
  grid: "Poster style"
  textures: "Grain, halftones, wear"
  borders: "Decorative frames"

components:
  badges: "Seals, ribbons"
  images: "Desaturated, grainy photos"
  buttons: "Simple, textured"

style-guide:
  - "Nostalgia for 50s/60s/70s"
  - "Warm, aged aesthetic"
  - "Texture is key (grain, dust)"
  - "Fun and familiar"`
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
            themeLabel: theme === 'dark' ? 'Dark' : 'Light',
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

            // Removed actions (open button) as per request

            card.appendChild(meta);

            grid.appendChild(card);

            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            // Click card to open website
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevent default if clicking on links/buttons inside (though we removed them)
                if (e.target.closest('a') || e.target.closest('button')) return;
                window.open(style.url, '_blank', 'noopener');
            });

            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            const groupIndex = Math.floor(index / 4);
            const delay = groupIndex * 0.1;
            card.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
            observer.observe(card);
        });
    }

    // Initialize Mouse-tracking Spotlight
    function initSpotlight(selector) {
        const cards = document.querySelectorAll(selector);
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // Apply to all card-like elements
    setTimeout(() => {
        initSpotlight('.principle-card, .constraint-card, .application-item, .framework-panel, .style-embed-card, .tool-card, .card-base, .collection-card');
    }, 500); // Delay slightly to ensure elements are rendered

});
