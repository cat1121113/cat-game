// =================================================================================
// Firebase Configuration
// =================================================================================
const firebaseConfig = {
    apiKey: "AIzaSyBuQQDrUOA02fgvJoqS6r0NcuUJKc425dI",
    authDomain: "cat-game-b255f.firebaseapp.com",
    databaseURL: "https://cat-game-b255f-default-rtdb.firebaseio.com",
    projectId: "cat-game-b255f",
    storageBucket: "cat-game-b255f.firebasestorage.app",
    messagingSenderId: "297850331034",
    appId: "1:297850331034:web:08d24d2f0a463ee773e423"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// =================================================================================
// 全域變數定義
// =================================================================================
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const coinCounterSpan = document.getElementById('coinCounter');
const throughWallStatusSpan = document.getElementById('throughWallStatus');
const gameTimerSpan = document.getElementById('gameTimer'); // For game timer

// Modal elements
const messageModal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const modalCloseButton = document.getElementById('modalCloseButton');

// Player Name Modal elements
const playerNameModal = document.getElementById('playerNameModal');
const playerNameInput = document.getElementById('playerNameInput');
const startGameButton = document.getElementById('startGameButton');

// Leaderboard element
const leaderboardBody = document.getElementById('leaderboardBody');

const tileSize = 32; // 每個方塊的大小

function getInitialMap() {
    return [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
        [1,2,1,0,0,1,2,1,0,0,0,1,2,1,1,2,1,0,0,0,1,2,1,0,0,1,2,1],
        [1,2,1,0,0,1,2,1,0,1,0,1,2,1,1,2,1,0,1,0,1,2,1,0,0,1,2,1],
        [1,2,1,1,1,1,2,1,0,1,0,1,2,1,1,2,1,0,1,0,1,2,1,1,1,1,2,1],
        [1,2,2,2,2,2,2,2,0,1,0,0,2,2,2,2,0,1,0,0,2,2,2,2,2,2,2,1],
        [1,2,1,1,1,1,2,1,0,1,1,1,1,1,1,1,0,1,1,1,1,2,1,1,1,1,2,1],
        [1,2,1,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,1,2,1],
        [1,2,1,0,0,1,2,1,0,1,1,1,0,1,1,0,1,1,1,0,1,2,1,0,0,1,2,1],
        [1,2,1,1,0,1,2,1,0,1,0,0,0,0,0,0,0,0,1,0,1,2,1,0,1,1,2,1],
        [1,2,2,1,0,1,2,1,0,1,0,1,1,1,1,1,1,0,1,0,1,2,1,0,1,2,2,1],
        [1,1,2,1,0,1,2,1,0,1,0,1,2,2,2,2,1,0,1,0,1,2,1,0,1,2,1,1],
        [1,1,1,1,0,0,2,0,0,0,0,1,2,1,1,2,1,0,0,0,0,2,0,0,1,2,1,0], // Exit was here map[14][0]
        [0,0,2,1,0,0,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,0,1,2,1,0], // Player start at map[14][0] or similar
        [3,1,2,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,1,0], // Original Exit map[15][0]
        [1,1,2,1,0,1,2,1,1,1,1,1,1,0,0,1,1,1,1,1,1,2,1,0,1,2,1,0],
        [1,1,2,1,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,1,2,1,0],
        [1,1,2,1,0,1,2,1,0,1,1,1,1,1,1,1,1,1,0,1,1,2,1,0,1,2,1,0],
        [1,1,2,1,0,1,2,1,0,1,2,2,2,2,2,2,2,1,0,1,1,2,1,0,1,2,1,1],
        [1,2,2,1,0,1,2,1,0,1,2,1,1,1,1,1,2,1,0,1,1,2,1,0,1,2,2,1],
        [1,2,1,1,0,1,2,1,0,1,2,2,0,0,0,1,2,1,0,1,1,2,1,0,1,0,2,1],
        [1,2,1,0,0,1,2,1,0,1,2,1,1,1,1,1,2,1,0,1,1,2,1,0,0,1,2,1],
        [1,2,1,0,0,1,2,1,0,1,2,2,2,1,2,2,2,1,0,1,1,2,1,0,0,1,2,1],
        [1,2,1,1,0,1,2,1,0,1,1,1,2,1,2,1,1,1,0,1,1,2,1,0,1,1,2,1],
        [1,2,2,1,0,1,2,1,0,0,0,1,2,1,2,1,0,0,0,1,1,2,1,0,1,2,2,1],
        [1,1,2,1,0,1,2,1,1,1,0,1,2,1,2,1,0,1,1,1,1,2,1,0,1,2,1,1],
        [1,2,2,2,0,0,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,0,0,2,2,2,1],
        [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];
}

let map = getInitialMap();

const initialPlayer = { x: 1, y: 1, color: "#74b9ff" }; // 左上角 (1,1) 通常是金幣格，安全
const initialGhost = { x: 26, y: 11, color: "#ff7675" }; // 鬼魂位置可保持或按需調整


let player = { ...initialPlayer };
let ghost = { ...initialGhost };

let totalCoins = 0;
let collectedCoins = 0;
let gameOver = false;
let canThroughWall = false;
let throughWallTimer = null;
let gameLoopInterval;
let gameTimerInterval; // For the game clock
let gameStartTime;
let currentPlayerName = "小貓咪"; // Default player name

// =================================================================================
// 遊戲初始化及開始流程
// =================================================================================
window.onload = function() {
    showPlayerNameModal();
    loadLeaderboard();
};

function showPlayerNameModal() {
    playerNameModal.classList.add('show');
    playerNameInput.focus();
    // Ensure game canvas and other elements are not interactive yet
}

startGameButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        currentPlayerName = name;
    } else {
        currentPlayerName = "小貓咪"; // Default if empty
    }
    playerNameModal.classList.remove('show');
    initializeGame();
});

function initializeGame() {
    map = getInitialMap(); // 獲取初始地圖副本
    player = { ...initialPlayer }; // 使用新的起始位置
    ghost = { ...initialGhost };
    
    // Re-place items (ensure exit isn't where player starts immediately)
    // Example: map[14][0] is player start, so exit map[15][0] is fine.
    // The original map has exit at map[15][0]. Let's ensure player start is map[14][0] or another safe spot.
    // Player start moved to map[14][0] (an open space in the modified map) to not be on an item.
    // Ensure map[player.y][player.x] is 0 initially.
    // The player start should be an empty space, e.g. map[14][0] which is 0.
    // The original map[15][0] is 3 (exit). So if player starts at {x:0, y:15} it's an immediate win.
    // Let's use the provided player start x:1, y:1, and adjust exit.
    // player = { x: 1, y: 1 }; // Original example player start
    // map[15][0] = 3; // Original Exit
    // Let's use player {x:1, y:1} and make sure it's initially 0.
    // The provided map has player starting effectively in a coin spot. This is fine.
    // The provided initialPlayer is { x: 1, y: 1} which is on a '2' (coin).
    // The original code's `getInitialMap()` returns map[1][1] as 2. This seems fine.

    map[player.y][player.x] = 0; // Clear player's starting tile if it's a coin etc.
                                 // This should be 0 after collecting, so better to not place player on coin.
                                 // Using initialPlayer = { x: 14, y: 0 }; where map[14][0] is 0.

    // Place dynamic items
    map[8][23] = 4;  // Fish
    map[17][14] = 4; // Fish
    map[11][4] = 4;  // Fish
    map[15][0] = 3;   // Ensure Exit is at a known, reachable location. Original: map[15][0] = 3
                      // If player starts at x:1,y:1, map[15][0] is a valid exit.

    totalCoins = calculateTotalCoins();
    collectedCoins = 0;
    gameOver = false;
    canThroughWall = false;
    
    clearTimeout(throughWallTimer);
    clearInterval(gameTimerInterval);
    clearInterval(gameLoopInterval); // Clear this too

    gameStartTime = Date.now();
    gameTimerSpan.textContent = '時間: 0s';

    messageModal.classList.remove('show');
    modalMessage.innerHTML = '';
    modalCloseButton.textContent = '再玩一次'; // Default button text
    modalCloseButton.onclick = () => initializeGame(); // Default action

    canvas.width = map[0].length * tileSize;
    canvas.height = map.length * tileSize;

    update();
    startGameLoop();
    loadLeaderboard(); // Refresh leaderboard when game restarts
}


function calculateTotalCoins() {
    let count = 0;
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 2) {
                count++;
            }
        }
    }
    return count;
}

// =================================================================================
// 遊戲渲染函數
// =================================================================================
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPlayer(player);
    drawPlayer(ghost);

    coinCounterSpan.textContent = `金幣: ${collectedCoins} / ${totalCoins}`;
    throughWallStatusSpan.textContent = canThroughWall ? '啟用中' : '關閉';

    checkGameState(); // Check game state after updates
}

// =================================================================================
// 繪製迷宮地圖及物件 (drawMap, drawCat, drawGhost, drawPlayer are unchanged from original)
// =================================================================================
function drawMap() {
    // 先畫背景（牆 or 地板）
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = "#c8b4e3"; // 牆壁顏色
            } else {
                ctx.fillStyle = "#ffffff"; // 地板顏色
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // 再畫其他物件：金幣、魚、出口
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 2) { // 金幣
                ctx.fillStyle = "#ffe066"; // 金幣顏色
                ctx.beginPath();
                ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tileSize / 4, 0, Math.PI * 2);
                ctx.fill();
            } else if (map[y][x] === 3) { // 出口 (手掌圖標)
                const baseX = x * tileSize;
                const baseY = y * tileSize;
                const centerX = baseX + tileSize / 2;
                const centerY = baseY + tileSize / 2;
                ctx.fillStyle = "#f8a5c2"; 
                ctx.fillRect(baseX, baseY, tileSize, tileSize);
                ctx.fillStyle = "#ffffff"; 
                ctx.beginPath();
                ctx.arc(centerX, centerY + 2, tileSize * 0.15, 0, Math.PI * 2); 
                ctx.fill();
                const toes = [
                    [-tileSize * 0.18, -tileSize * 0.12],
                    [0, -tileSize * 0.18],
                    [tileSize * 0.18, -tileSize * 0.12]
                ];
                for (let [dx, dy] of toes) {
                    ctx.beginPath();
                    ctx.arc(centerX + dx, centerY + dy, tileSize * 0.06, 0, Math.PI * 2); 
                    ctx.fill();
                }
            } else if (map[y][x] === 4) { // 魚 (穿牆道具)
                const centerX = x * tileSize + tileSize / 2;
                const centerY = y * tileSize + tileSize / 2;
                ctx.fillStyle = "#55efc4"; 
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, tileSize * 0.25, tileSize * 0.15, 0, 0, Math.PI * 2); 
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(centerX - tileSize * 0.25, centerY);
                ctx.lineTo(centerX - tileSize * 0.375, centerY - tileSize * 0.125);
                ctx.lineTo(centerX - tileSize * 0.375, centerY + tileSize * 0.125);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "#ffffff"; 
                ctx.beginPath();
                ctx.arc(centerX + tileSize * 0.125, centerY - tileSize * 0.03, tileSize * 0.06, 0, Math.PI * 2); 
                ctx.fill();
                ctx.fillStyle = "#2d3436"; 
                ctx.beginPath();
                ctx.arc(centerX + tileSize * 0.125, centerY - tileSize * 0.03, tileSize * 0.03, 0, Math.PI * 2); 
                ctx.fill();
            }
        }
    }

    if (canThroughWall) {
        ctx.fillStyle = "#81ecec";
        ctx.font = "14px Arial";
        ctx.fillText("可以穿牆中...", 10, canvas.height - 10);
    }
}

function drawCat(x, y) {
    const px = x * tileSize;
    const py = y * tileSize;
    const pixelSize = tileSize / 8;
    const pixels = [
        [0, 0, 1, 0, 0, 1, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [1, 1, 2, 1, 1, 2, 1, 1],
        [1, 1, 1, 2, 2, 1, 1, 1], [1, 3, 1, 1, 1, 1, 3, 1], [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1, 0, 0], [0, 0, 1, 0, 0, 1, 0, 0],
    ];
    for (let row = 0; row < pixels.length; row++) {
        for (let col = 0; col < pixels[row].length; col++) {
            const value = pixels[row][col];
            if (value === 0) continue;
            if (value === 1) ctx.fillStyle = "#b2bec3"; 
            else if (value === 2) ctx.fillStyle = "#2d3436"; 
            else if (value === 3) ctx.fillStyle = "#ff8fa3"; 
            ctx.fillRect(px + col * pixelSize, py + row * pixelSize, pixelSize, pixelSize);
        }
    }
}

function drawGhost(x, y) {
    const cx = x * tileSize;
    const cy = y * tileSize;
    const r = tileSize / 2;
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(cx + r, cy + r, r - 1, Math.PI, 0); 
    ctx.lineTo(cx + tileSize - 1, cy + tileSize - 4); 
    ctx.lineTo(cx + tileSize * 0.75, cy + tileSize);    
    ctx.lineTo(cx + tileSize * 0.5, cy + tileSize - 4); 
    ctx.lineTo(cx + tileSize * 0.25, cy + tileSize);    
    ctx.lineTo(cx + 1, cy + tileSize - 4); 
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx + tileSize * 0.3, cy + tileSize * 0.4, tileSize * 0.2, 0, Math.PI * 2);
    ctx.arc(cx + tileSize * 0.7, cy + tileSize * 0.4, tileSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.arc(cx + tileSize * 0.33, cy + tileSize * 0.43, tileSize * 0.08, 0, Math.PI * 2);
    ctx.arc(cx + tileSize * 0.73, cy + tileSize * 0.43, tileSize * 0.08, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayer(obj) {
    if (obj === player) drawCat(obj.x, obj.y);
    else if (obj === ghost) drawGhost(obj.x, obj.y);
}


// =================================================================================
// 遊戲狀態檢查
// =================================================================================
function checkGameState() {
    if (gameOver) return;

    if (ghost.x === player.x && ghost.y === player.y) {
        gameOver = true;
        clearInterval(gameTimerInterval); // Stop timer
        showCustomMessage("你被鬼抓到了！遊戲結束。", false);
        return;
    }

    if (map[player.y][player.x] === 3 && collectedCoins === totalCoins) {
        gameOver = true;
        clearInterval(gameTimerInterval); // Stop timer
        const timePlayed = Math.floor((Date.now() - gameStartTime) / 1000);
        showCustomMessage(`恭喜！你成功逃出迷宮！<br>你的分數: ${collectedCoins}<br>花費時間: ${timePlayed} 秒`, true, collectedCoins, timePlayed);
        return;
    }
}

// =================================================================================
// 玩家移動邏輯
// =================================================================================
document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    if (gameOver) return;

    let nx = player.x;
    let ny = player.y;

    if (e.key === "ArrowUp") ny--;
    if (e.key === "ArrowDown") ny++;
    if (e.key === "ArrowLeft") nx--;
    if (e.key === "ArrowRight") nx++;

    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) return;

    const isWall = map[ny][nx] === 1;

    if (!isWall || canThroughWall) {
        player.x = nx;
        player.y = ny;
        const tile = map[ny][nx];
        if (tile === 2) {
            map[ny][nx] = 0;
            collectedCoins++;
        }
        if (tile === 4) {
            map[ny][nx] = 0;
            activateThroughWall();
        }
    }
    update();
});

// =================================================================================
// 穿牆能力啟動
// =================================================================================
function activateThroughWall() {
    canThroughWall = true;
    clearTimeout(throughWallTimer);
    throughWallTimer = setTimeout(() => {
        canThroughWall = false;
        update();
    }, 5000);
    update();
}

// =================================================================================
// 遊戲循環 (鬼魂移動 和 計時器)
// =================================================================================
function startGameLoop() {
    clearInterval(gameLoopInterval); // Clear existing loops
    clearInterval(gameTimerInterval);

    gameLoopInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(gameLoopInterval);
            return;
        }
        moveGhost();
        update();
    }, 250);

    gameTimerInterval = setInterval(updateGameTimeDisplay, 1000);
}

function updateGameTimeDisplay() {
    if (!gameOver && gameStartTime) {
        const secondsPassed = Math.floor((Date.now() - gameStartTime) / 1000);
        gameTimerSpan.textContent = `時間: ${secondsPassed}s`;
    }
}

function moveGhost() {
    const path = findPath([ghost.x, ghost.y], [player.x, player.y]);
    if (path && path.length > 1) {
        ghost.x = path[1][0];
        ghost.y = path[1][1];
    }
}

// =================================================================================
// 尋路演算法 (BFS - unchanged)
// =================================================================================
function findPath(start, goal) {
    const queue = [[start]];
    const visited = new Set();
    visited.add(start.toString());
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (queue.length > 0) {
        const path = queue.shift();
        const [x, y] = path[path.length - 1];
        if (x === goal[0] && y === goal[1]) return path;
        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[0].length &&
                map[ny][nx] !== 1 && !visited.has([nx, ny].toString())) {
                visited.add([nx, ny].toString());
                queue.push([...path, [nx, ny]]);
            }
        }
    }
    return null;
}

// =================================================================================
// 自定義訊息模態框 (Updated)
// =================================================================================
function showCustomMessage(message, isWin = false, score, timePlayed) {
    modalMessage.innerHTML = message; // Use innerHTML to render <br> tags

    if (isWin) {
        modalCloseButton.textContent = '提交分數並再玩一次';
        modalCloseButton.onclick = () => {
            saveScoreToFirebase(currentPlayerName, score, timePlayed);
            // saveScoreToFirebase will handle updating the button text and action after submission
        };
    } else { // Player lost or other general messages
        modalCloseButton.textContent = '再玩一次';
        modalCloseButton.onclick = () => {
            initializeGame();
        };
    }
    messageModal.classList.add('show');
}

// =================================================================================
// Firebase Leaderboard Functions
// =================================================================================
function saveScoreToFirebase(name, score, timePlayed) {
    const timestamp = new Date().toISOString();
    const scoreData = {
        playerName: name,
        score: score,
        timePlayed: timePlayed,
        timestamp: timestamp
    };

    database.ref('scores').push(scoreData)
        .then(() => {
            console.log("Score saved successfully!");
            modalMessage.innerHTML += "<br><b>分數已成功儲存！</b>";
            loadLeaderboard(); // Refresh leaderboard
        })
        .catch((error) => {
            console.error("Error saving score: ", error);
            modalMessage.innerHTML += "<br><b>儲存分數失敗，請檢查網路連線。</b>";
        })
        .finally(() => {
            // After attempting to save, change button to "Play Again"
            modalCloseButton.textContent = '再玩一次';
            modalCloseButton.onclick = () => {
                initializeGame();
            };
        });
}

function loadLeaderboard() {
    // Order by score descending, then by timePlayed ascending.
    // Firebase doesn't support multi-field sorting directly in one query like this.
    // We fetch by score and then sort client-side for the secondary criteria.
    const scoresRef = database.ref('scores').orderByChild('score').limitToLast(10); // Fetches lowest scores if not reversed.

    scoresRef.on('value', (snapshot) => {
        leaderboardBody.innerHTML = ''; // Clear existing rows
        const scores = [];
        snapshot.forEach((childSnapshot) => {
            scores.push(childSnapshot.val());
        });

        // Sort: Score (desc), Time (asc)
        scores.sort((a, b) => {
            if (b.score === a.score) {
                return a.timePlayed - b.timePlayed; // Shorter time is better
            }
            return b.score - a.score; // Higher score is better
        });
        // If scoresRef was limitToLast(10) to get *highest* scores,
        // and 'score' is positive, it would need to be inverted or fetched differently.
        // For now, this fetches 10, then sorts. If many scores, might need indexing on "-score" or fetching more.
        // Given limitToLast(10) on 'score', it means it gets the 10 highest scores if scores are positive.

        scores.forEach((entry, index) => {
            const row = leaderboardBody.insertRow();
            row.insertCell().textContent = index + 1; // Rank
            row.insertCell().textContent = entry.playerName;
            row.insertCell().textContent = entry.score;
            row.insertCell().textContent = entry.timePlayed;
            row.insertCell().textContent = new Date(entry.timestamp).toLocaleDateString();
        });
        if (scores.length === 0) {
             leaderboardBody.innerHTML = '<tr><td colspan="5">目前尚無紀錄</td></tr>';
        }
    }, (error) => {
        console.error("Error loading leaderboard: ", error);
        leaderboardBody.innerHTML = '<tr><td colspan="5">無法載入排行榜</td></tr>';
    });
}

// Note: The original modalCloseButton event listener at the end of script.js has been removed
// as its functionality is now handled by showCustomMessage and saveScoreToFirebase.