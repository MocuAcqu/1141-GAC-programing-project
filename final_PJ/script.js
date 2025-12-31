const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('music-toggle');
const tutorialModal = document.getElementById('tutorial-modal');

if(bgm) bgm.volume = 0.4; 

window.closeTutorial = function() {
    if (tutorialModal) {
        tutorialModal.style.transition = "opacity 0.3s";
        tutorialModal.style.opacity = "0";
        setTimeout(() => {
            tutorialModal.classList.add('hidden');
            tutorialModal.style.opacity = "1";
        }, 300);
    }
};

window.toggleMusic = function() {
    if (bgm.paused) {
        bgm.play();
        musicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else {
        bgm.pause();
        musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
};

const characters = [
    {
        id: "student",
        name: "當代大學生",
        role: "學生 Student",
        desc: "青春無限潛力，目前正在享受學習的樂趣",
        color: "#0ff",
        stats: { int: 80, vit: 40, luk: 60 },
        img: "images/student.jpg"
    },
    {
        id: "worker",
        name: "斜槓青年",
        role: "工作者 worker",
        desc: "用咖啡因換取程式碼，多元經驗累積",
        color: "#f0f",
        stats: { int: 95, vit: 20, luk: 10 },
        img: "images/worker.jpg"
    },
    {
        id: "club",
        name: "活躍社團人",
        role: "社團幹部 Committee Members",
        desc: "社交能力點滿，團隊合作與活動企劃",
        color: "#ffaa00",
        stats: { int: 60, vit: 90, luk: 70 },
        img: "images/club.jpg"
    },
    {
        id: "tina",
        name: "Tina",
        role: "傳說級原作者",
        desc: "創作者總是在成果之前被隱藏的角色呢。",
        color: "#00ff00",
        stats: { int: 100, vit: 100, luk: 100 },
        img: "images/332210.jpg"
    }
];

let currentIndex = 0;
let unlockedTina = false; 
let konamiBuffer = "";

const charName = document.getElementById('char-name');
const charRole = document.getElementById('char-role');
const charDesc = document.getElementById('char-desc');
const charImg = document.getElementById('char-img-placeholder');
const root = document.documentElement;

function updateCharacterDisplay() {
    const char = characters[currentIndex];
    charName.innerText = char.name;
    charRole.innerText = char.role;
    charDesc.innerText = char.desc;
    if (char.img.includes('gradient')) {
        charImg.style.background = char.img;
    } else {
        charImg.style.background = `url('${char.img}') center / cover no-repeat`;
    }
    root.style.setProperty('--primary', char.color);
}

updateCharacterDisplay();

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const toggleIcon = toggleBtn.querySelector('i');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('expanded');
    
    if (sidebar.classList.contains('expanded')) {
        toggleIcon.classList.replace('fa-bars', 'fa-chevron-left');
    } else {
        toggleIcon.classList.replace('fa-chevron-left', 'fa-bars');
    }
});

window.quickNav = function(target) {
    
    if (!document.getElementById('intro-screen').classList.contains('hidden')) return;

    if (target === 'home') {
        switchScreen('home');
    } else {
        const roleMap = {
            'student': 0,
            'worker': 1,
            'club': 2
        };

        if (roleMap[target] !== undefined) {
            currentIndex = roleMap[target];
            updateCharacterDisplay();
        }

        switchScreen('detail');
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

        const targetView = document.getElementById(`view-${target}`);
        if (targetView) targetView.classList.remove('hidden');
    }

    if (window.innerWidth < 768) {
        sidebar.classList.remove('expanded');
        sidebar.classList.add('collapsed');
        toggleIcon.classList.replace('fa-chevron-left', 'fa-bars');
    }
};

document.getElementById('next-char').addEventListener('click', () => {
    let limit = unlockedTina ? characters.length : characters.length - 1;
    currentIndex = (currentIndex + 1) % limit;
    updateCharacterDisplay();
});

document.getElementById('prev-char').addEventListener('click', () => {
    let limit = unlockedTina ? characters.length : characters.length - 1;
    currentIndex = (currentIndex - 1 + limit) % limit;
    updateCharacterDisplay();
});

document.addEventListener('keydown', (e) => {
    konamiBuffer += e.key.toLowerCase();
    if (konamiBuffer.length > 4) {
        konamiBuffer = konamiBuffer.slice(-4);
    }
    
    if (konamiBuffer === "tina" && !unlockedTina) {
        unlockedTina = true;
        alert("隱藏角色 TINA 已解鎖！");
        currentIndex = 3;
        updateCharacterDisplay();
    }
});

const screens = {
    intro: document.getElementById('intro-screen'),
    home: document.getElementById('home-screen'),
    detail: document.getElementById('detail-screen'),
    game: document.getElementById('game-screen')
};

function switchScreen(screenName) {
    Object.values(screens).forEach(s => {
        if(s) s.classList.add('hidden');
        if(s) s.classList.remove('active-screen');
    });
    
    const target = screens[screenName];
    if (target) {
        target.classList.remove('hidden');
    }
}

sidebar.style.opacity = '0'; 
sidebar.style.pointerEvents = 'none';
window.enterCharacterSelect = function() {
    const introScreen = document.getElementById('intro-screen');
    const homeScreen = document.getElementById('home-screen');
    const gameStart = document.getElementById('game-start')

    introScreen.classList.add('fade-out-anim');

    if (bgm) {
        bgm.play().catch(e => console.log("Audio play failed:", e));
    }

    setTimeout(() => {
        switchScreen('home');
        homeScreen.classList.add('fade-in-anim');
        gameStart.classList.remove('hidden');

        sidebar.style.transition = 'opacity 0.5s';
        sidebar.style.opacity = '1';
        sidebar.style.pointerEvents = 'auto';

        if (tutorialModal) {
            tutorialModal.classList.remove('hidden');
        }

    }, 1400); 
};

document.getElementById('go-detail').addEventListener('click', () => {
    switchScreen('detail');
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    
    const charId = characters[currentIndex].id;
    const targetView = document.getElementById(`view-${charId}`);
    if (targetView) targetView.classList.remove('hidden');
});

document.getElementById('back-home').addEventListener('click', () => {
    switchScreen('home');
});

const clubData = {
    'petit': {
        name: "Petit 派緹甜點社",
        roles: [
            {
                title: "113學年度甜點社社長 (第11屆社長)",
                img: "images/332281_0.jpg",
                desc: "身兼社團之活動、美宣、公關、場器等工作，工作包含社團行政管理規劃、幹部與社員之間互動、課程安排、活動籌備、社群平台發文等。\n\n我成功提高甜點社關注度，於該屆提升約三倍之社員招募人數，並完善各種社團事務行程規劃與雲端文件，過程中向內舉辦過看電影吃甜點例會，向外曾與動物陣線週系列合作，製作動物造型無蛋無奶餅乾，並打破過去多屆未實體擺攤的情況，舉辦甜點週系列活動。"
            },
            {
                title: "2024年甜點周系列 - 時光甜點屋",
                img: "images/332301.jpg",
                desc: "身為活動之總籌，在活動前期招募合作夥伴、安排分工、主導籌備會議，並協助產品、美宣、公關、場器等事務，中期顧班擺攤、確認夥伴任務完成情況、產品數量與狀況，後期確認財務、產品結算，完成活動抽獎、器材歸還等。\n\n當時所有產品有全數售完，並且成功讓在校學生看見甜點社的存在。"
            },
            {
                title: "甜點社員",
                img: "images/332273_0.jpg",
                desc: "參加甜點課課程，學習麵包、蛋糕等製作過程，並參與2023年甜點周籌備。"
            }
        ]
    },

    'gaoping': {
        name: "高屏地區同鄉鄉友會",
        roles: [
            {
                title: "團康培訓課程、演技培訓課程講師",
                img: "images/332304_0.jpg",
                desc: "帶領新一屆美輔股與大劇股成員，建立心態、認識自己的角色定位、傳承注意事項、技巧學習與實際演練、經驗分享。"
            },
            {
                title: "行政文宣股股長 (第29屆幹部)",
                img: "images/332308.jpg",
                desc: "協助會議黑板板繪、參與會上各事務處理、製作會員文宣品、設計該屆主視覺與LOGO。"
            },
            {
                title: "文化週美食股股長",
                img: "images/332275.jpg",
                desc: "與夥伴主導美食股各事務籌備，包含人員招募、分工、試煮，以及周系列實體產品製作、販售、顧攤等。"
            },
            {
                title: "高屏之夜大劇股股員",
                img: "images/332284_0.jpg",
                desc: "扮演晚會戲劇主角，飾演一位魔術師，因為經歷愛鴿被殺、團長欠債被推去討債等過程，最終殺害所有身邊的人並抱著後悔離開世界。過程經歷撰寫劇本、排練。"
            },
            {
                title: "高屏返鄉服務隊美輔股股員",
                img: "images/332285_0.jpg",
                desc: "帶領國小營隊的小隊，隨時確認小孩狀況、解決突發狀況、引導小孩參與活動和課程、帶團康活動。並表演營隊活動之戲劇和舞蹈、協助劇本撰寫。"
            }
        ]
    },

    'dorm': {
        name: "學七舍宿舍委員會",
        roles: [
            {
                title: "113學年活動長",
                img: "images/332278_0.jpg",
                desc: "每學期籌辦宿舍三大活動，撰寫計畫書、主導會議與分工、監督與執行活動進度，並協助宿舍基本行政義務項目，如協助住宿生進退宿、寒暑假寄領物、引導防災演練、解決宿舍突發狀況等。"
            },
            {
                title: "114學年副舍長",
                img: "images/332200_0.jpg",
                desc: "協助舍長進行各種行政規劃與事物執行，進行宿舍規劃、監督各幹部任務執行、解決住宿生問題與突發狀況、成為校方與輔導員對於幹部之間的溝通管道、協助主導各行政事物與分工。以及開設Podcast與YouTube，定期更新內容增加住宿生資訊接收管道。"
            }
        ]
    }
};

window.switchClub = function(clubKey, element) {
    document.querySelectorAll('.club-tab').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    const data = clubData[clubKey];
    document.getElementById('selected-club-title').innerText = data.name;

    const listContainer = document.getElementById('quest-list-container');
    listContainer.innerHTML = ''; 

    data.roles.forEach((role, index) => {
        const btn = document.createElement('div');
        btn.className = 'quest-btn';
        btn.innerText = role.title.split(' ')[0]; 
        btn.innerText = role.title; 
        
        btn.onclick = () => showMissionDetail(clubKey, index, btn);
        listContainer.appendChild(btn);
    });

    if (listContainer.firstChild) {
        listContainer.firstChild.click();
    }
};

window.showMissionDetail = function(clubKey, index, btnElement) {
    document.querySelectorAll('.quest-btn').forEach(el => el.classList.remove('active'));
    btnElement.classList.add('active');

    const role = clubData[clubKey].roles[index];
    const contentBox = document.getElementById('mission-content');

    let imgHtml = '';
    if (role.img && role.img.trim() !== "") {
        imgHtml = `
            <div class="mission-photo-frame">
                <img src="${role.img}" alt="Activity Photo">
                <div class="frame-border"></div>
            </div>
        `;
    }

    contentBox.innerHTML = `
        <h2 class="mission-title">${role.title}</h2>
        ${imgHtml}
        <div class="mission-desc">
            <p>${role.desc}</p>
        </div>
    `;
};

setTimeout(() => {
    const firstTab = document.querySelector('.club-tab');
    if (firstTab) {
        switchClub('petit', firstTab); 
    }
}, 500);

window.showClubDetail = function(club) {
    document.getElementById('club-info-box').innerText = clubData[club];
}

const workData = {
    'job1': {
        title: "社群媒體小編 & 工讀生",
        company: "橙工房 (Orange Workshop) | Taipei",
        date: "May 2025 - Present",
        img: "images/296782.jpg",
        desc: [
            "協助海報、傳單、社群媒體圖文製作與發文，LINE官方帳號建立與管理",
            "協助活動、課程、產品販售等規劃與執行，擔任合作活動之助教。"
        ],
        tags: ["Social Media", "Design", "Event Planning"]
    },
    'job2': {
        title: "AI 實習生 (AI Intern)",
        company: "JUBO (智齡科技) | New Taipei",
        date: "Jun 2025 - Aug 2025",
        img: "images/332271_0.jpg",
        desc: [
            "負責 N-Copilot A個管情境之功能開發，包含前後端功能開發，如錄音轉錄、客製化 prompt等。",
            "實作錄音轉錄 (Whisper) 與客製化 Prompt 優化模型回應。並使用 LangChain 與 LangGraph 進行 AI 流程控管。",
            "有 GitLab 協作、Jira 開卡規劃、GCP 部署、Docker 容器化應用等經驗"
        ],
        tags: ["Python", "JavaScript", "Docker", "GitLab"]
    },
    'job3': {
        title: "AI Team 外包工程師",
        company: "JUBO (智齡科技) | New Taipei",
        date: "Sep 2025 - Present",
        img: "images/332270_0.jpg",
        desc: [
            "負責 N-Copilot 專案維護與功能開發，根據使用者回饋調整專案。",
            "負責公司產品統合、規劃與開發。"
        ],
        tags: ["Full Stack","Product Maintenance"]
    },
    'job4': {
        title: "影片後製剪輯工讀生",
        company: "NTNU (臺師大)| Taipei",
        date: "Oct 2023 – Aug 2025",
        desc: [
            "製作與剪輯教學影片，主要使用Capcut進行後製。",
            "更換影片中的語言、字幕、圖片與音軌，並協助進行AI配音。"
        ],
        tags: ["Video Editing and Inspection", "AI Voice", "Image and Text Creation"]
    },
    'job5': {
        title: "餐廳外場服務生",
        company: "YAYOI (彌生軒) | Taipei",
        date: "Jul 2024 – Sep 2024 ",
        img: "images/332289.jpg",
        desc: [
            "透過有效溝通提供耐心且友善的顧客服務，靈活應對突發狀況。",
            "協助帶位、上餐、收桌、收銀、清潔等服務。"
        ],
        tags: ["Waitress", "Cashier", "Cleaner"]
    }
};

window.selectJob = function(id) {
    const data = workData[id];
    if (!data) return;

    const contentBox = document.getElementById('job-detail-content');
    
    let tagsHtml = data.tags.map(t => `<span class="j-tag">${t}</span>`).join('');
    let listHtml = data.desc.map(d => `<li>${d}</li>`).join('');
    let visualHtml = '';

    if (data.img && data.img.trim() !== "") {
        visualHtml = `
            <div class="job-visual-col">
                <div class="visual-frame">
                    <div class="visual-img" style="background-image: url('${data.img}');"></div>
                    <div class="corner-decor top-left"></div>
                    <div class="corner-decor bottom-right"></div>
                </div>
            </div>
        `;
    }

    contentBox.innerHTML = `
        <div class="job-layout-grid" style="animation: fadeIn 0.5s">
            
            <div class="job-info-col">
                <div class="job-title">${data.title}</div>
                <span class="job-time">[${data.date}]</span>
                <span class="job-company">${data.company}</span>
                <ul class="job-desc-list">
                    ${listHtml}
                </ul>
                <div class="job-tags">
                    <span style="color:#888;">STACK:</span> ${tagsHtml}
                </div>
            </div>
            ${visualHtml}

        </div>
    `;

    document.querySelectorAll('.timeline-node').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.job-btn').forEach(el => el.classList.remove('active'));

    const activeNode = document.querySelector(`.timeline-node[data-id="${id}"]`);
    const activeBtn = document.querySelector(`.job-btn[data-id="${id}"]`);
    
    if (activeNode) activeNode.classList.add('active');
    if (activeBtn) activeBtn.classList.add('active');
};

setTimeout(() => {
    if(document.querySelector('.timeline-node[data-id="job3"]')) {
        selectJob('job3');
    }
}, 500);

window.showWorkDetail = function(id) {
    document.getElementById('work-card-content').innerText = workData[id];
    document.querySelectorAll('.timeline-point').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.timeline-point')[id-1].classList.add('active');
}

const phoneModal = document.getElementById('phone-modal');
const phoneContent = document.getElementById('phone-content');

document.getElementById('contact-btn').addEventListener('click', () => {
    phoneModal.classList.remove('hidden');
    switchPhoneTab('contact');
});

document.getElementById('close-phone').addEventListener('click', () => {
    phoneModal.classList.add('hidden');
});

window.switchPhoneTab = function(tab) {
    let html = '';
    
    const githubUrl = "https://github.com/MocuAcqu"; 

    if (tab === 'contact') {
        html = `
            <div class="app-screen contact-screen">
                <div class="contact-header">
                    <div class="contact-avatar" style="background-image: url('images/332198_0.jpg')"></div>
                    <h2>邱鈺婷 (Tina)</h2>
                </div>
                <div class="contact-actions">
                    <a href="tel:0901422997" class="c-btn"><i class="fa-solid fa-phone"></i> Call</a>
                    <a href="mailto:a0901422997@gmail.com" class="c-btn"><i class="fa-solid fa-envelope"></i> Mail</a>
                </div>
                <div class="contact-list">
                    <div class="c-item">
                        <label>Mobile</label>
                        <span>0901-422-997</span>
                    </div>
                    <div class="c-item">
                        <label>Email</label>
                        <span>a0901422997@gmail.com</span>
                    </div>
                    <div class="c-item">
                        <label>Location</label>
                        <span>Taipei, Taiwan</span>
                    </div>
                </div>
            </div>
        `;
    } else if (tab === 'ig') {
        html = `
            <div class="app-screen ig-screen">
                <!-- 限時動態列 -->
                <div class="story-tray">
                    <div class="story-item">
                        <div class="story-ring"><div class="story-img" style="background-image: url('images/332204.jpg')"></div></div>
                        <span>你的限時動態</span>
                    </div>
                    <div class="story-item">
                        <div class="story-ring"><div class="story-img" style="background-image: url('images/332201.jpg')"></div></div>
                        <span>keep_running</span>
                    </div>
                    <div class="story-item">
                        <div class="story-ring"><div class="story-img" style="background-image: url('images/332274_0.jpg')"></div></div>
                        <span>beautiful_TD</span>
                    </div>
                </div>

                <!-- 貼文 1 -->
                <div class="ig-post-card">
                    <div class="ig-header">
                        <div class="ig-avatar" style="background-image: url('images/332204.jpg')"></div>
                        <span class="ig-user">mocu_acqu</span>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                    <div class="ig-image" style="background-image: url('images/332312.jpg')"></div>
                    <div class="ig-actions">
                        <div class="ig-icons-left">
                            <i class="fa-regular fa-heart"></i>
                            <i class="fa-regular fa-comment"></i>
                            <i class="fa-regular fa-paper-plane"></i>
                        </div>
                        <i class="fa-regular fa-bookmark"></i>
                    </div>
                    <div class="ig-caption">
                        <strong>mocu_acqu</strong> 我得獎了!!
                    </div>
                </div>
            </div>
        `;
    } else if (tab === 'github') { 
        html = `
            <div class="app-screen repo-screen">
                <h3 class="app-title"><i class="fa-brands fa-github"></i> Repositories</h3>

                <div class="repo-card">
                    <div class="repo-left">
                        <a href="${githubUrl}" target="_blank" class="repo-link">
                            <strong>My GitHub Profile</strong> <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <small>MocuAcqu</small>
                        <p>點擊連結查看我的所有專案與開源貢獻。</p>
                    </div>
                </div>

                <div class="repo-card">
                    <div class="repo-left">
                        <a href="https://github.com/MocuAcqu/MocuProject" target="_blank" class="repo-link">
                            <strong>MocuProject</strong> <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <small>MocuAcqu</small>
                        <p>關於 Project 可以看這個!</p>
                    </div>
                </div>
            </div>
        `;
    }
    phoneContent.innerHTML = html;
}

const roleStats = {
    'student': { health: 80, hunger: 60, mood: 90, wealth: 1000, name: '學生' },
    'worker': { health: 60, hunger: 80, mood: 50, wealth: 5000, name: '工作者' },
    'club': { health: 70, hunger: 80, mood: 80, wealth: 2000, name: '社團人' },
    'tina': { health: 100, hunger: 100, mood: 100, wealth: 99999, name: 'Tina' }
};

let gameState = {
    day: 1,
    health: 100,
    hunger: 100,
    mood: 100,
    wealth: 0,
    isOver: false
};

const maxDays = 15;

const uiDay = document.getElementById('sim-day');
const uiRole = document.getElementById('sim-role-name');
const barHealth = document.getElementById('bar-health');
const barHunger = document.getElementById('bar-hunger');
const barMood = document.getElementById('bar-mood');
const barWealth = document.getElementById('bar-wealth');

const valHealth = document.getElementById('val-health');
const valHunger = document.getElementById('val-hunger');
const valMood = document.getElementById('val-mood');
const valWealth = document.getElementById('val-wealth');

const logContent = document.getElementById('sim-log-content');
const actionBtns = document.querySelector('.sim-actions');
const endControls = document.getElementById('sim-end-controls');

document.getElementById('game-start-btn').addEventListener('click', () => {
    switchScreen('game');
    initGame();
});

function initGame() {
    const charId = characters[currentIndex].id;
    const stats = roleStats[charId] || roleStats['worker'];

    gameState = {
        day: 1,
        health: stats.health,
        hunger: stats.hunger,
        mood: stats.mood,
        wealth: stats.wealth,
        isOver: false
    };

    uiRole.innerText = stats.name;
    logContent.innerHTML = `> 模擬開始。身分：${stats.name}<br>> 目標：存活 15 天並達成最高成就。`;
    actionBtns.classList.remove('hidden');
    endControls.classList.add('hidden');
    
    updateSimUI();
}

function updateSimUI() {
    uiDay.innerText = gameState.day;
    
    setBar(barHealth, valHealth, gameState.health, 100);
    setBar(barHunger, valHunger, gameState.hunger, 100);
    setBar(barMood, valMood, gameState.mood, 100);
    
    setBar(barWealth, valWealth, gameState.wealth, 10000); 
}

function setBar(bar, text, val, max) {
    let pct = (val / max) * 100;
    if (pct > 100) pct = 100;
    if (pct < 0) pct = 0;
    bar.style.width = `${pct}%`;
    text.innerText = val;
}

function addLog(msg, type='') {
    const p = document.createElement('div');
    p.className = `log-entry ${type}`;
    p.innerHTML = `<span class="log-day">Day ${gameState.day}:</span> ${msg}`;
    logContent.prepend(p); 
}

window.simAction = function(action) {
    if (gameState.isOver) return;

    let msg = "";
    
    if (action === 'work') {
        gameState.wealth += 1000;
        gameState.hunger -= 25;
        gameState.mood -= 20;
        gameState.health -= 5;
        msg = "努力工作，錢包變厚了，但肚子餓了心情也變差。";
    } else if (action === 'eat') {
        if (gameState.wealth >= 300) {
            gameState.wealth -= 300;
            gameState.hunger += 40;
            gameState.health += 5;
            gameState.mood += 5;
            msg = "吃了一頓大餐！身心滿足。";
        } else {
            addLog("錢不夠吃大餐！只能喝西北風...", "log-bad");
            gameState.hunger -= 10;
            gameState.mood -= 10;
            checkStatus();
            return;
        }
    } else if (action === 'play') {
        if (gameState.wealth >= 500) {
            gameState.wealth -= 500;
            gameState.mood += 40;
            gameState.hunger -= 10;
            msg = "瘋狂玩樂了一整天，心情大好！";
        } else {
            addLog("沒錢玩樂，覺得自己很可悲...", "log-bad");
            gameState.mood -= 20;
            checkStatus();
            return;
        }
    } else if (action === 'rest') {
        gameState.health += 20;
        gameState.hunger -= 10;
        gameState.mood += 20;
        msg = "在家睡了一整天，恢復了體力。";
    }

    addLog(msg);
    
    if (gameState.hunger > 100) gameState.hunger = 100;
    if (gameState.mood > 100) gameState.mood = 100;
    if (gameState.health > 100) gameState.health = 100;

    checkStatus();

    if (!gameState.isOver) {
        gameState.day++;
        if (gameState.day > maxDays) {
            endGame(true);
        } else {
            updateSimUI();
        }
    }
};

function checkStatus() {
    if (gameState.hunger <= 20) {
        gameState.health -= 10;
        addLog("肚子太餓了，生命值下降！", "log-bad");
    } 

    if (gameState.hunger <= 0) {
        gameState.health -= 25;
        addLog("快餓死了！！", "log-bad");
        gameState.hunger = 0;
    }

    if (gameState.mood <= 20) {
        gameState.health -= 5;
        addLog("心情太差，導致生病了...", "log-bad");
    }

    if (gameState.mood <= 0) {
        gameState.mood = 0;
    }

    if (gameState.health <= 0) {
        gameState.health = 0;
        endGame(false);
    }
    updateSimUI();
}

function endGame(survived) {
    gameState.isOver = true;
    actionBtns.classList.add('hidden');
    endControls.classList.remove('hidden');

    const title = document.getElementById('sim-result-title');
    const desc = document.getElementById('sim-result-desc');

    if (!survived) {
        title.innerText = "BAD ENDING: 過勞死 / 餓死";
        title.style.color = "red";
        desc.innerText = "很遺憾，你在這殘酷的社會中倒下了。請注意身心健康。";
    } else {
        title.style.color = "#0f0";
        if (gameState.wealth >= 8000 && gameState.mood >= 70) {
            title.innerText = "PERFECT ENDING: 財富自由的快樂人生";
            desc.innerText = "你達成了一般人夢寐以求的境界，有錢又有閒！";
        } else if (gameState.wealth >= 8000) {
            title.innerText = "ENDING: 孤獨的富豪";
            desc.innerText = "你非常有錢，但可能犧牲了太多生活品質。";
        } else if (gameState.mood >= 70) {
            title.innerText = "ENDING: 樂天派生活家";
            desc.innerText = "雖然錢不多，但你過得非常快樂，這才是人生！";
        } else {
            title.innerText = "NORMAL ENDING: 平凡的恩賜";
            desc.innerText = "你平安度過了這半個月，繼續為生活努力吧。";
        }
    }
}

window.quitGame = function() {
    switchScreen('home');
    const homeScreen = document.getElementById('home-screen');
    
    setTimeout(() => {
        homeScreen.classList.add('fade-in-anim');
    }, 10);
    
};

const academicHistory = {
    gpa: [
        { sem: '大一上 (Year 1-1)', val: '4.28' },
        { sem: '大一下 (Year 1-2)', val: '4.30' },
        { sem: '大二上 (Year 2-1)', val: '4.29' },
        { sem: '大二下 (Year 2-2)', val: '4.29' }
    ],
    rank: [
        { sem: '大一上 (Year 1-1)', val: 'Rank 1' },
        { sem: '大一下 (Year 1-2)', val: 'Rank 1' },
        { sem: '大二上 (Year 2-1)', val: 'Rank 1' },
        { sem: '大二下 (Year 2-2)', val: 'Rank 2' }
    ]
};

const historyModal = document.getElementById('history-modal');
const historyTitle = document.getElementById('history-title');
const historyContent = document.getElementById('history-content');

window.showHistory = function(type) {
    historyModal.classList.remove('hidden');
    historyContent.innerHTML = '';

    let data = [];
    if (type === 'gpa') {
        historyTitle.innerText = "歷年 GPA 紀錄";
        data = academicHistory.gpa;
    } else if (type === 'rank') {
        historyTitle.innerText = "歷年系級排名";
        data = academicHistory.rank;
    }

    data.forEach(item => {
        const row = document.createElement('div');
        row.className = 'history-row';
        row.innerHTML = `
            <span class="sem-name">${item.sem}</span>
            <span class="sem-value">${item.val}</span>
        `;
        historyContent.appendChild(row);
    });
};

window.closeHistory = function() {
    historyModal.classList.add('hidden');
};

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        closeHistory();
    }
});