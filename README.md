# ФОРУМ 360

Статический сайт на Vite, React и TypeScript.

Сайт рассчитан на размещение через GitHub Pages с собственным доменом. Серверная админка удалена: GitHub Pages не запускает Node.js, SQLite и загрузку файлов.

## Локальный запуск

```bash
npm install
npm run dev
```

Перед `dev` и `build` ассеты копируются в `public/assets/`: логотипы, фото кейсов и элементы команды.

## Сборка

```bash
npm run build
```

Готовый статический сайт появляется в папке `dist/`.

## Деплой

При push в `main` GitHub Actions собирает сайт и публикует `dist/` в ветку `gh-pages`.

Workflow: `.github/workflows/deploy.yml`.

После первого деплоя в настройках репозитория нужно включить GitHub Pages:

1. Repository → Settings.
2. Pages.
3. Source: Deploy from a branch.
4. Branch: `gh-pages`.
5. Folder: `/ (root)`.
6. Save.

## Собственный домен

Подробная инструкция лежит в `GITHUB_PAGES_DOMAIN_GUIDE.md`.

Домен проекта: `форум360.рф`.

Техническая запись для GitHub Pages: `xn--360-jedjmvf.xn--p1ai`.

Коротко:

- в GitHub Pages указать custom domain;
- в DNS домена прописать A-записи GitHub Pages;
- для `www` прописать CNAME на аккаунт GitHub;
- дождаться проверки DNS;
- включить Enforce HTTPS.

## Индексация

Сайт закрыт от индексации поисковиками:

- `meta robots`;
- `public/robots.txt`.

Это не парольная защита. Сайт доступен всем, у кого есть прямая ссылка.

## Тесты

```bash
npx playwright install
npm run test:e2e
```
