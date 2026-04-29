
        // Inisialisasi Typed.js untuk efek teks mengetik
        document.addEventListener('DOMContentLoaded', function() {
            // Typed.js untuk teks dinamis
            const typed = new Typed('.typed-text', {
                strings: ['Web Developer', 'Mobile Legend Player', 'Pelajar SMK', 'Tech Enthusiast'],
                typeSpeed: 50,
                backSpeed: 30,
                loop: true
            });
            
            // Membuat bintang di background
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 150; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.width = Math.random() * 3 + 'px';
                star.style.height = star.style.width;
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.opacity = Math.random() * 0.7 + 0.3;
                starsContainer.appendChild(star);
            }
            
            // Membuat bangunan untuk animasi kota
            const buildingsContainer = document.getElementById('buildings');
            for (let i = 0; i < 15; i++) {
                const building = document.createElement('div');
                building.classList.add('building');
                building.style.height = Math.random() * 150 + 80 + 'px';
                building.style.backgroundColor = i % 3 === 0 ? '#1a1a2e' : i % 3 === 1 ? '#16213e' : '#0f3460';
                buildingsContainer.appendChild(building);
            }
            
            // Game Space Invader sederhana
            const gameContainer = document.getElementById('gameContainer');
            const scoreDisplay = document.getElementById('scoreDisplay');
            const livesDisplay = document.getElementById('livesDisplay');
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            const restartBtn = document.getElementById('restartBtn');
            
            let score = 0;
            let lives = 3;
            let gameInterval;
            
            // Fungsi untuk memulai game
            function startGame() {
                stopGame();
                
                // Reset game
                score = 0;
                lives = 3;
                updateDisplays();
                gameContainer.innerHTML = '';
                
                // Buat player (pesawat)
                const player = document.createElement('div');
                player.id = 'player';
                player.style.position = 'absolute';
                player.style.bottom = '20px';
                player.style.left = '50%';
                player.style.transform = 'translateX(-50%)';
                player.style.width = '50px';
                player.style.height = '50px';
                player.style.backgroundColor = '#6c63ff';
                player.style.borderRadius = '5px';
                player.innerHTML = '🚀';
                player.style.fontSize = '30px';
                player.style.textAlign = 'center';
                player.style.lineHeight = '50px';
                gameContainer.appendChild(player);
                
                // Kontrol player dengan keyboard
                let playerX = 50;
                const moveSpeed = 2;
                
                function movePlayer(direction) {
                    if (direction === 'left' && playerX > 5) {
                        playerX -= moveSpeed;
                    } else if (direction === 'right' && playerX < 95) {
                        playerX += moveSpeed;
                    }
                    player.style.left = playerX + '%';
                }
                
                // Event listener untuk keyboard
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowLeft') {
                        movePlayer('left');
                    } else if (e.key === 'ArrowRight') {
                        movePlayer('right');
                    } else if (e.key === ' ') {
                        // Tembak
                        shoot(playerX);
                    }
                });
                
                // Buat musuh
                const enemies = [];
                
                function createEnemy() {
                    const enemy = document.createElement('div');
                    enemy.classList.add('enemy');
                    enemy.style.position = 'absolute';
                    enemy.style.top = '20px';
                    enemy.style.left = Math.random() * 90 + '%';
                    enemy.style.width = '40px';
                    enemy.style.height = '40px';
                    enemy.style.backgroundColor = '#ff6584';
                    enemy.style.borderRadius = '50%';
                    enemy.innerHTML = '👾';
                    enemy.style.fontSize = '25px';
                    enemy.style.textAlign = 'center';
                    enemy.style.lineHeight = '40px';
                    gameContainer.appendChild(enemy);
                    
                    enemies.push({
                        element: enemy,
                        x: parseFloat(enemy.style.left),
                        y: 20,
                        speed: Math.random() * 1 + 0.5
                    });
                }
                
                // Fungsi untuk menembak
                function shoot(x) {
                    const bullet = document.createElement('div');
                    bullet.classList.add('bullet');
                    bullet.style.position = 'absolute';
                    bullet.style.bottom = '70px';
                    bullet.style.left = x + '%';
                    bullet.style.width = '5px';
                    bullet.style.height = '15px';
                    bullet.style.backgroundColor = '#00ff00';
                    bullet.style.borderRadius = '2px';
                    gameContainer.appendChild(bullet);
                    
                    const bulletInterval = setInterval(() => {
                        const bulletBottom = parseFloat(bullet.style.bottom);
                        if (bulletBottom > 400) {
                            bullet.remove();
                            clearInterval(bulletInterval);
                            return;
                        }
                        
                        bullet.style.bottom = (bulletBottom + 5) + 'px';
                        
                        // Cek tabrakan dengan musuh
                        enemies.forEach((enemy, index) => {
                            const enemyRect = enemy.element.getBoundingClientRect();
                            const bulletRect = bullet.getBoundingClientRect();
                            
                            if (
                                bulletRect.left < enemyRect.right &&
                                bulletRect.right > enemyRect.left &&
                                bulletRect.top < enemyRect.bottom &&
                                bulletRect.bottom > enemyRect.top
                            ) {
                                // Tabrakan terjadi
                                enemy.element.remove();
                                enemies.splice(index, 1);
                                bullet.remove();
                                clearInterval(bulletInterval);
                                score += 100;
                                updateDisplays();
                            }
                        });
                    }, 20);
                }
                
                // Game loop
                gameInterval = setInterval(() => {
                    // Buat musuh baru secara acak
                    if (Math.random() < 0.05) {
                        createEnemy();
                    }
                    
                    // Pindahkan musuh
                    enemies.forEach((enemy, index) => {
                        enemy.y += enemy.speed;
                        enemy.element.style.top = enemy.y + 'px';
                        
                        // Jika musuh mencapai bawah
                        if (enemy.y > 450) {
                            enemy.element.remove();
                            enemies.splice(index, 1);
                            lives--;
                            updateDisplays();
                            
                            if (lives <= 0) {
                                gameOver();
                            }
                        }
                    });
                    
                    // Cek tabrakan player dengan musuh
                    const playerRect = player.getBoundingClientRect();
                    enemies.forEach((enemy, index) => {
                        const enemyRect = enemy.element.getBoundingClientRect();
                        
                        if (
                            playerRect.left < enemyRect.right &&
                            playerRect.right > enemyRect.left &&
                            playerRect.top < enemyRect.bottom &&
                            playerRect.bottom > enemyRect.top
                        ) {
                            // Tabrakan terjadi
                            enemy.element.remove();
                            enemies.splice(index, 1);
                            lives--;
                            updateDisplays();
                            
                            if (lives <= 0) {
                                gameOver();
                            }
                        }
                    });
                }, 50);
            }
            
            function stopGame() {
                if (gameInterval) {
                    clearInterval(gameInterval);
                }
            }
            
            function restartGame() {
                stopGame();
                startGame();
            }
            
            function gameOver() {
                stopGame();
                const gameOverMsg = document.createElement('div');
                gameOverMsg.style.position = 'absolute';
                gameOverMsg.style.top = '50%';
                gameOverMsg.style.left = '50%';
                gameOverMsg.style.transform = 'translate(-50%, -50%)';
                gameOverMsg.style.color = '#ff6584';
                gameOverMsg.style.fontSize = '2rem';
                gameOverMsg.style.fontWeight = 'bold';
                gameOverMsg.style.textAlign = 'center';
                gameOverMsg.innerHTML = 'GAME OVER<br><span style="font-size:1.5rem">Skor Akhir: ' + score + '</span>';
                gameContainer.appendChild(gameOverMsg);
            }
            
            function updateDisplays() {
                scoreDisplay.textContent = 'Skor: ' + score;
                
                let hearts = '';
                for (let i = 0; i < lives; i++) {
                    hearts += '❤️';
                }
                livesDisplay.innerHTML = hearts;
            }
            
            // Event listeners untuk tombol game
            startBtn.addEventListener('click', startGame);
            stopBtn.addEventListener('click', stopGame);
            restartBtn.addEventListener('click', restartGame);
        });