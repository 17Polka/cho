document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы
    const authTypeSelector = document.getElementById('authTypeSelector');
    const userAuthSection = document.getElementById('userAuthSection');
    const adminAuthSection = document.getElementById('adminAuthSection');
    
    // Кнопки выбора типа авторизации
    const authTypeCards = document.querySelectorAll('.auth-type-card');
    const selectTypeButtons = document.querySelectorAll('.btn-select-type');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item[data-section]');
    const mobileNavItems = document.querySelectorAll('.nav-item[data-section]');
    
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Пользовательская авторизация
    const personalDataForm = document.getElementById('personalDataForm');
    const gosuslugiForm = document.getElementById('gosuslugiForm');
    const userSuccessStep = document.getElementById('userSuccessStep');
    const userBackButton = document.getElementById('userBackButton');
    const userBackToSelect = document.getElementById('userBackToSelect');
    const userLogoutBtn = document.getElementById('userLogoutBtn');
    
    // Административная авторизация
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminSuccessStep = document.getElementById('adminSuccessStep');
    const adminBackToSelect = document.getElementById('adminBackToSelect');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    
    // Данные пользователя
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const middleNameInput = document.getElementById('middleName');
    const snilsInput = document.getElementById('snils');
    const confirmFullName = document.getElementById('confirmFullName');
    const confirmSnils = document.getElementById('confirmSnils');
    const welcomeName = document.getElementById('welcomeName');
    
    // Данные администратора
    const adminLoginInput = document.getElementById('adminLogin');
    const adminPasswordInput = document.getElementById('adminPassword');
    
    // Переменные состояния
    let currentAuthType = 'user';
    let userData = {};
    let currentUserStep = 0;
    
    // ====================
    // ОБЩИЕ ФУНКЦИИ
    // ====================
    
    // Переключение типа авторизации
    function switchAuthType(type) {
        currentAuthType = type;
        
        // Скрыть все секции
        authTypeSelector.style.display = 'none';
        userAuthSection.style.display = 'none';
        adminAuthSection.style.display = 'none';
        
        // Сбросить активные карточки
        authTypeCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Показать выбранную секцию
        if (type === 'user') {
            userAuthSection.style.display = 'block';
            document.querySelector('.auth-type-card[data-type="user"]').classList.add('active');
            resetUserAuth();
        } else if (type === 'admin') {
            adminAuthSection.style.display = 'block';
            document.querySelector('.auth-type-card[data-type="admin"]').classList.add('active');
            resetAdminAuth();
        }
        
        // Обновить мобильное меню
        updateMobileMenu(type);
        
        // Закрыть мобильное меню
        mobileMenu.classList.remove('open');
    }
    
    // Возврат к выбору типа
    function backToTypeSelector() {
        authTypeSelector.style.display = 'block';
        userAuthSection.style.display = 'none';
        adminAuthSection.style.display = 'none';
        
        // Сбросить все формы
        resetUserAuth();
        resetAdminAuth();
        
        mobileMenu.classList.remove('open');
    }
    
    // Обновление мобильного меню
    function updateMobileMenu(type) {
        mobileMenuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === `${type}-auth`) {
                item.classList.add('active');
            }
        });
        
        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === `${type}-auth`) {
                item.classList.add('active');
            }
        });
    }
    
    // Показать уведомление
    function showNotification(message, type = 'info') {
        const colors = {
            info: '#1a73e8',
            success: '#34a853',
            error: '#d93025',
            warning: '#f9ab00'
        };
        
        const notification = document.createElement('div');
        notification.className = 'mobile-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1002;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 90%;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;
        
        // Добавить стиль анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { top: 60px; opacity: 0; }
                to { top: 80px; opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
                if (style.parentNode) {
                    document.head.removeChild(style);
                }
            }, 300);
        }, 3000);
    }
    
    // ====================
    // ПОЛЬЗОВАТЕЛЬСКАЯ АВТОРИЗАЦИЯ
    // ====================
    
    // Сброс пользовательской авторизации
    function resetUserAuth() {
        personalDataForm.reset();
        gosuslugiForm.reset();
        document.getElementById('consent').checked = false;
        document.getElementById('gosuslugiConsent').checked = false;
        userSuccessStep.style.display = 'none';
        goToUserStep(0);
        userData = {};
    }
    
    // Переход между шагами пользователя
    function goToUserStep(step) {
        currentUserStep = step;
        
        // Скрыть все шаги
        const userFormSteps = userAuthSection.querySelectorAll('.form-step');
        userFormSteps.forEach(step => step.classList.remove('active'));
        
        // Показать нужный шаг
        if (step === 0) {
            personalDataForm.classList.add('active');
        } else if (step === 1) {
            gosuslugiForm.classList.add('active');
        } else if (step === 2) {
            userSuccessStep.classList.add('active');
        }
        
        // Обновить прогресс
        const steps = userAuthSection.querySelectorAll('.step');
        steps.forEach((stepEl, index) => {
            if (index <= step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });
        
        // Обновить мобильный прогресс-бар
        const mobileProgress = document.getElementById('userMobileProgressFill');
        if (mobileProgress) {
            const progress = step === 0 ? '50%' : step === 1 ? '100%' : '100%';
            mobileProgress.style.width = progress;
        }
        
        // Прокрутить вверх на мобильных
        if (window.innerWidth <= 768) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
    
    // Валидация ФИО
    function validateName(name) {
        const nameRegex = /^[А-ЯЁ][а-яё]*(-[А-ЯЁ][а-яё]*)?$/;
        return nameRegex.test(name);
    }
    
    // Валидация СНИЛС
    function validateSnils(snils) {
        const snilsRegex = /^\d{3}-\d{3}-\d{3} \d{2}$/;
        return snilsRegex.test(snils);
    }
    
    // Показать ошибку в поле
    function showError(inputId, message) {
        const errorElement = document.getElementById(inputId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            document.getElementById(inputId).style.borderColor = '#d93025';
        }
    }
    
    // Очистить ошибку
    function clearError(inputId) {
        const errorElement = document.getElementById(inputId + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            document.getElementById(inputId).style.borderColor = '#ddd';
        }
    }
    
    // Маска для СНИЛС
    snilsInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = value.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
            e.target.value = !value[2] ? value[1] : value[1] + '-' + value[2] + (value[3] ? '-' + value[3] : '') + (value[4] ? ' ' + value[4] : '');
        }
    });
    
    // Валидация формы пользователя
    function validateUserForm() {
        let isValid = true;
        
        // Фамилия
        if (!lastNameInput.value.trim()) {
            showError('lastName', 'Введите фамилию');
            isValid = false;
        } else if (!validateName(lastNameInput.value.trim())) {
            showError('lastName', 'Фамилия должна начинаться с заглавной буквы');
            isValid = false;
        } else {
            clearError('lastName');
        }
        
        // Имя
        if (!firstNameInput.value.trim()) {
            showError('firstName', 'Введите имя');
            isValid = false;
        } else if (!validateName(firstNameInput.value.trim())) {
            showError('firstName', 'Имя должно начинаться с заглавной буквы');
            isValid = false;
        } else {
            clearError('firstName');
        }
        
        // Отчество (необязательно)
        if (middleNameInput.value.trim() && !validateName(middleNameInput.value.trim())) {
            showError('middleName', 'Отчество должно начинаться с заглавной буквы');
            isValid = false;
        } else {
            clearError('middleName');
        }
        
        // СНИЛС
        if (!snilsInput.value.trim()) {
            showError('snils', 'Введите номер СНИЛС');
            isValid = false;
        } else if (!validateSnils(snilsInput.value.trim())) {
            showError('snils', 'Неверный формат СНИЛС');
            isValid = false;
        } else {
            clearError('snils');
        }
        
        // Согласие
        if (!document.getElementById('consent').checked) {
            showNotification('Необходимо дать согласие на обработку данных', 'warning');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Отправка формы пользователя
    personalDataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateUserForm()) {
            userData = {
                lastName: lastNameInput.value.trim(),
                firstName: firstNameInput.value.trim(),
                middleName: middleNameInput.value.trim(),
                snils: snilsInput.value.trim()
            };
            
            // Показать данные в следующем шаге (правильный порядок ФИО)
            const fullName = `${userData.lastName} ${userData.firstName} ${userData.middleName}`.trim();
            confirmFullName.textContent = fullName;
            confirmSnils.textContent = userData.snils;
            
            goToUserStep(1);
        }
    });
    
    // Отправка формы Госуслуг
    gosuslugiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!document.getElementById('gosuslugiConsent').checked) {
            showNotification('Необходимо согласие на передачу данных в Госуслуги', 'warning');
            return;
        }
        
        // Имитация загрузки
        const submitBtn = gosuslugiForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Подключение...</span>';
        submitBtn.disabled = true;
        
        // Имитация запроса к Госуслугам
        setTimeout(() => {
            // Успешная авторизация
            const welcomeText = `${userData.lastName} ${userData.firstName} ${userData.middleName}`.trim();
            welcomeName.textContent = welcomeText;
            
            goToUserStep(2);
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            showNotification('Авторизация через Госуслуги успешна!', 'success');
        }, 2000);
    });
    
    // Кнопка "Назад" в пользовательской форме
    userBackButton.addEventListener('click', function() {
        goToUserStep(0);
    });
    
    // Выход пользователя
    userLogoutBtn.addEventListener('click', function() {
        resetUserAuth();
        backToTypeSelector();
        showNotification('Вы вышли из системы', 'info');
    });
    
    // ====================
    // АДМИНИСТРАТИВНАЯ АВТОРИЗАЦИЯ
    // ====================
    
    // Сброс административной авторизации
    function resetAdminAuth() {
        adminLoginForm.reset();
        adminSuccessStep.style.display = 'none';
        adminLoginForm.style.display = 'block';
    }
    
    // Валидация формы администратора
    function validateAdminForm() {
        let isValid = true;
        
        // Логин
        if (!adminLoginInput.value.trim()) {
            showError('adminLogin', 'Введите логин');
            isValid = false;
        } else {
            clearError('adminLogin');
        }
        
        // Пароль
        if (!adminPasswordInput.value.trim()) {
            showError('adminPassword', 'Введите пароль');
            isValid = false;
        } else if (adminPasswordInput.value.length < 6) {
            showError('adminPassword', 'Пароль должен быть не менее 6 символов');
            isValid = false;
        } else {
            clearError('adminPassword');
        }
        
        return isValid;
    }
    
    // Проверка учетных данных администратора
    function checkAdminCredentials(login, password) {
        // Тестовые учетные данные
        const testCredentials = [
            { login: 'admin', password: 'admin123', role: 'Супер администратор' },
            { login: 'moderator', password: 'moderator123', role: 'Модератор' },
            { login: 'support', password: 'support123', role: 'Техподдержка' }
        ];
        
        const user = testCredentials.find(
            cred => cred.login === login && cred.password === password
        );
        
        return user ? { success: true, role: user.role } : { success: false };
    }
    
    // Отправка формы администратора
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateAdminForm()) {
            return;
        }
        
        const login = adminLoginInput.value.trim();
        const password = adminPasswordInput.value.trim();
        
        // Имитация загрузки
        const submitBtn = adminLoginForm.querySelector('.btn-admin');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Проверка...</span>';
        submitBtn.disabled = true;
        
        // Проверка учетных данных
        setTimeout(() => {
            const result = checkAdminCredentials(login, password);
            
            if (result.success) {
                // Успешный вход
                document.getElementById('adminRole').textContent = result.role;
                document.getElementById('lastLoginTime').textContent = new Date().toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) + ' ' + new Date().toLocaleDateString('ru-RU');
                
                adminLoginForm.style.display = 'none';
                adminSuccessStep.style.display = 'block';
                
                showNotification(`Добро пожаловать, ${login}!`, 'success');
            } else {
                // Ошибка входа
                showNotification('Неверный логин или пароль', 'error');
                showError('adminLogin', ' ');
                showError('adminPassword', 'Неверные учетные данные');
            }
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // Выход администратора
    adminLogoutBtn.addEventListener('click', function() {
        resetAdminAuth();
        backToTypeSelector();
        showNotification('Администратор вышел из системы', 'info');
    });
    
    // ====================
    // ОБРАБОТЧИКИ СОБЫТИЙ
    // ====================
    
    // Выбор типа авторизации
    selectTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchAuthType(type);
        });
    });
    
    authTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchAuthType(type);
        });
    });
    
    // Мобильное меню
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            const type = section.replace('-auth', '');
            switchAuthType(type);
        });
    });
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            const type = section.replace('-auth', '');
            switchAuthType(type);
        });
    });
    
    // Кнопки "Назад"
    userBackToSelect.addEventListener('click', backToTypeSelector);
    adminBackToSelect.addEventListener('click', backToTypeSelector);
    
    // Мобильное меню
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Автоматическая валидация при вводе
    [lastNameInput, firstNameInput, middleNameInput].forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() && !validateName(this.value.trim())) {
                showError(this.id, 'Должно начинаться с заглавной буквы');
            } else {
                clearError(this.id);
            }
        });
    });
    
    snilsInput.addEventListener('blur', function() {
        if (this.value.trim() && !validateSnils(this.value.trim())) {
            showError('snils', 'Формат: XXX-XXX-XXX YY');
        } else {
            clearError('snils');
        }
    });
    
    // Закрытие клавиатуры на мобильных
    const textInputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    textInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && window.innerWidth <= 768) {
                e.preventDefault();
                this.blur();
            }
        });
    });
    
    // Адаптация шрифтов
    function adjustFontSize() {
        if (window.innerWidth <= 360) {
            document.documentElement.style.fontSize = '14px';
        } else if (window.innerWidth <= 480) {
            document.documentElement.style.fontSize = '15px';
        } else {
            document.documentElement.style.fontSize = '16px';
        }
    }
    
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    
    // Инициализация
    updateMobileMenu('user');
});