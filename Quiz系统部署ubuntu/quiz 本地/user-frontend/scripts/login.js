document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('请填写所有字段');
        return;
    }

    axios.post('http://localhost:8080/login', {
        username: username,
        password: password
    })
    .then(function(response) {
        const res = response.data;
        if (res.code === 1) {
            // 登录成功，保存token并跳转
            localStorage.setItem('token', res.data);
            localStorage.setItem('username', username);
            window.location.href = 'quiz.html';
        } else {
            // 登录失败，提示用户
            alert(res.msg || '登录失败');
        }
    })
    .catch(function(error) {
        alert('请求失败，请稍后重试');
        console.error(error);
    });
});
