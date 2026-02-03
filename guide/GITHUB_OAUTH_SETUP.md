# GitHub OAuth Setup Guide

## Шаг 1: Создание GitHub OAuth App

1. Перейди на GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Нажми **New OAuth App**
3. Заполни форму:
   - **Application name**: `RetroStore`
   - **Homepage URL**: `http://localhost:3000` (для разработки) или `https://yoursite.com` (для продакшна)
   - **Authorization callback URL**: `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/6968bd2a002ab5ee4a4a`
   
4. Нажми **Register application**
5. Скопируй **Client ID**
6. Нажми **Generate a new client secret** и скопируй **Client Secret**

## Шаг 2: Настройка в Appwrite Console

1. Открой [Appwrite Console](https://fra.cloud.appwrite.io)
2. Выбери проект **RetroStore**
3. Перейди в **Auth** → **Settings**
4. Найди **GitHub** в списке провайдеров
5. Включи переключатель
6. Вставь:
   - **App ID**: твой GitHub Client ID
   - **App Secret**: твой GitHub Client Secret
7. Нажми **Update**

## Шаг 3: Обновление callback URL для продакшна

Когда будешь деплоить на продакшн:
1. В GitHub OAuth App обнови **Authorization callback URL** на продакшн URL
2. Добавь в **Homepage URL** продакшн URL

## Готово!

Теперь в диалоге авторизации появится кнопка "Continue with GitHub" 🎉

Пользователи смогут:
- Войти через GitHub без создания пароля
- Быстро регистрироваться используя GitHub аккаунт
- Автоматически подтягивать имя и email из GitHub

## Дополнительные провайдеры

Можешь также добавить:
- Google OAuth
- Discord OAuth  
- Apple OAuth
- И другие из списка Appwrite

Процесс настройки аналогичный для всех провайдеров.
