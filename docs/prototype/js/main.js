// 卡片翻转效果
document.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// 搜索框清空按钮
document.querySelectorAll('.clear-btn').forEach(btn => {
    const searchInput = btn.previousElementSibling;
    btn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
    });
});

// 表单字数限制
document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
    textarea.addEventListener('input', () => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        if (textarea.value.length > maxLength) {
            textarea.value = textarea.value.slice(0, maxLength);
        }
    });
});

// 设置页面的数字输入限制
document.querySelectorAll('.rule-item input[type="number"]').forEach(input => {
    input.addEventListener('input', () => {
        const value = parseInt(input.value);
        if (value < 1) input.value = 1;
        if (value > 365) input.value = 365;
    });
});

// 模拟按钮点击效果
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    });
});

// 登录页面交互
const loginBtn = document.getElementById('login-btn');
const loginLoading = document.getElementById('login-loading');
const loginError = document.getElementById('login-error');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginBtn.disabled = true;
        loginError.classList.add('hidden');
        loginLoading.classList.remove('hidden');
        setTimeout(() => {
            loginLoading.classList.add('hidden');
            // 随机模拟成功或失败
            if (Math.random() > 0.5) {
                // 登录成功，模拟跳转到今日复习页面（这里只是loading消失）
                loginBtn.disabled = false;
            } else {
                // 登录失败
                loginError.classList.remove('hidden');
                loginBtn.disabled = false;
            }
        }, 2000);
    });
} 