// Supabase configuration
const SUPABASE_URL = 'https://kjcqqbjsdglzvquakyze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqY3FxYmpzZGdsenZxdWFreXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjQ0NTksImV4cCI6MjA4NTcwMDQ1OX0.XDOJ4WNw3a6efWgJjjgTddSqceSuRG_3hcU4PNLN46M';

let supabaseClient;
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized');
    }
} catch (error) {
    console.log('Supabase error:', error);
}

let userData = { name: '', email: '', phone: '', response: '', message: '', timestamp: '' };
let noButtonMoved = false;
let noButtonClickCount = 0;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-bg');
    const hearts = ['♡', '♥', '💕'];
    
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 8 + 's';
        heart.style.fontSize = (Math.random() * 10 + 14) + 'px';
        heartsContainer.appendChild(heart);
    }
}

function startStory() {
    const name = document.getElementById('userName').value.trim();
    
    if (!name) {
        alert('I\'d love to know what to call you 😊');
        return;
    }
    
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    
    userData.name = name;
    userData.email = email || 'Not provided';
    userData.phone = phone || 'Not provided';
    userData.timestamp = new Date().toISOString();
    
    document.getElementById('welcomeForm').classList.add('hidden');
    document.getElementById('mainStory').classList.remove('hidden');
    
    const textMain = document.getElementById('textMain');
    textMain.innerHTML = `Hi ${name}, you know how some people just... fit into your world perfectly?`;
}

function moveNoButton() {
    const button = document.getElementById('noButton');
    const catImage = document.getElementById('catImage');
    const secretContainer = document.querySelector('.secret-no-container');
    
    noButtonClickCount++;
    
    // Show secret no button after 5 attempts
    if (noButtonClickCount >= 5) {
        secretContainer.style.display = 'block';
    }
    
    // Continuous escaping
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    
    const maxX = Math.max(20, screenWidth - buttonWidth - 20);
    const maxY = Math.max(20, screenHeight - buttonHeight - 20);
    
    let newX = getRandomNumber(20, maxX);
    let newY = getRandomNumber(20, maxY);
    
    button.style.position = 'fixed';
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
    button.style.zIndex = '1001';
    button.style.transition = 'all 0.3s ease';
    
    if (catImage) catImage.src = 'img/cats-sad.gif';
    
    const noTexts = [
        '🌿 I think we\'re better as friends',
        '😅 Nice try!',
        '😹 Almost got me!',
        '😼 Not happening!',
        '😸 Keep trying!',
        '😺 You\'re persistent!',
        '😻 Still no!',
        '😽 Nope nope nope!'
    ];
    
    const textIndex = Math.min(noButtonClickCount - 1, noTexts.length - 1);
    button.innerHTML = noTexts[textIndex];
    
    noButtonMoved = true;
}

function handleNo() {
    const catImage = document.getElementById('catImage');
    const modal = document.getElementById('responseModal');
    const message = document.getElementById('responseMessage');
    const feelingsInput = document.getElementById('feelingsInput');
    
    if (catImage) catImage.src = 'img/cats-sad.gif';
    
    userData.response = 'no';
    
    message.innerHTML = `I really appreciate your honesty 🌿 That takes courage, and I respect how you feel. Our friendship means a lot to me.`;
    feelingsInput.classList.remove('hidden');
    
    modal.classList.remove('hidden');
}

function handleYes() {
    const catImage = document.getElementById('catImage');
    const modal = document.getElementById('responseModal');
    const message = document.getElementById('responseMessage');
    const feelingsInput = document.getElementById('feelingsInput');
    
    if (catImage) catImage.src = 'img/love-cat.gif';
    
    userData.response = 'yes';
    
    message.innerHTML = `Oh wow, really? 🥰 This makes me so happy! There's no pressure at all — we can take things at whatever pace feels right for both of us.`;
    feelingsInput.classList.remove('hidden');
    
    modal.classList.remove('hidden');
    createConfetti();
}

async function submitResponse() {
    const feelingsInput = document.getElementById('feelingsInput');
    const message = feelingsInput.value.trim();
    
    if (!message) {
        alert('Please share your thoughts before submitting');
        return;
    }
    
    userData.message = message;
    
    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('proposal_responses')
                .insert([userData]);
            
            if (error) {
                console.error('Supabase error:', error);
                localStorage.setItem('proposalData', JSON.stringify(userData));
            } else {
                console.log('Data saved to Supabase:', userData);
            }
        } else {
            localStorage.setItem('proposalData', JSON.stringify(userData));
        }
    } catch (err) {
        console.error('Error:', err);
        localStorage.setItem('proposalData', JSON.stringify(userData));
    }
    
    const responseMessage = document.getElementById('responseMessage');
    responseMessage.innerHTML = `Thank you so much for sharing that with me 🌸<br/><br/>Whatever happens next, I'm just grateful we had this moment together.`;
    feelingsInput.style.display = 'none';
    document.getElementById('submitBtn').innerHTML = 'Close';
    document.getElementById('submitBtn').onclick = () => {
        document.getElementById('responseModal').classList.add('hidden');
    };
}

function createConfetti() {
    const colors = ['#ec4899', '#f472b6', '#fbbf24', '#fb7185'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `position:absolute;width:8px;height:8px;background:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;top:-10px;border-radius:50%;animation:confettiFall ${Math.random() * 3 + 2}s linear forwards;animation-delay:${Math.random() * 2}s`;
        confettiContainer.appendChild(confetti);
    }
    
    if (!document.querySelector('#confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = '@keyframes confettiFall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }';
        document.head.appendChild(style);
    }
    
    setTimeout(() => document.body.removeChild(confettiContainer), 5000);
}

function initialize() {
    createFloatingHearts();
    
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    const catImage = document.getElementById('catImage');
    
    if (noButton) {
        noButton.addEventListener('mouseenter', moveNoButton);
        noButton.addEventListener('click', moveNoButton);
    }
    
    if (yesButton && catImage) {
        yesButton.addEventListener('mouseenter', () => {
            if (!noButtonMoved && catImage.src.includes('cat-133_256.gif')) {
                catImage.src = 'img/love-cat.gif';
            }
        });
        
        yesButton.addEventListener('mouseleave', () => {
            if (!noButtonMoved && catImage.src.includes('love-cat.gif')) {
                catImage.src = 'img/cat-133_256.gif';
            }
        });
    }
    
    window.addEventListener('resize', () => {
        if (noButton && noButton.style.position === 'fixed') {
            moveNoButton();
        }
    });
}

document.addEventListener('DOMContentLoaded', initialize);