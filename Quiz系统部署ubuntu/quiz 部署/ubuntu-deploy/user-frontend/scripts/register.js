document.getElementById('register-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Reset error messages
    document.getElementById('username-error').style.display = 'none';
    document.getElementById('password-error').style.display = 'none';
    document.getElementById('confirm-error').style.display = 'none';

    let isValid = true;

    // Validation
    if (!username) {
        document.getElementById('username-error').style.display = 'block';
        isValid = false;
    }

    if (!password) {
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirm-error').style.display = 'block';
        isValid = false;
    }

    if (!isValid) return;

    // 使用axios发送注册请求
    axios.post('/api/register', {
        username: username,
        password: password,
        checkpassword: confirmPassword
    })
    .then(function(response) {
        const res = response.data;
        if (res.code === 1) {
            alert('注册成功！请登录。');
            window.location.href = 'login.html';
        } else {
            alert(res.msg || '注册失败');
        }
    })
    .catch(function(error) {
        alert('请求失败，请稍后重试');
        console.error(error);
    });
});
