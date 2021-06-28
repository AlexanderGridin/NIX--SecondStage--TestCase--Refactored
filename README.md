# Комментарии к тестовому заданию
## Получение данных
Получение данных осуществляется по ссылке - http://f0541354.xsph.ru/tasks

По адресу http://f0541354.xsph.ru я захостил тестовый сайт на CMS Drupal 9, который, при переходе на определенные страницы отдает JSON с данными тасков.
Данный хостинг является бесплатным, по этому и ссылка такая страшная...

## Github Pages
Он включен, но не рендерится таблица (вечно отображается loader), по причине следующей ошибки:

> Mixed Content: The page at 'https://alexandergridin.github.io/NIX--SecondStage--TestCase/' was loaded over HTTPS, but requested an insecure resource 'http://f0541354.xsph.ru/tasks'. This request has been blocked; the content must be served over HTTPS.

## Пагинация
Пагинация в таблице реализована таким образом, что она хорошо работает и в мобильной версии, по этому я её там не убирал.

## Начальный порядок сортировки данных в таблице
Т.к. для получения данных таблицы я использовал решение на CMS, изначально отдаваемые таски сортируются по дате добавления через админку. В связи с этим, начальный порядок сортировки по предустановленному полю я не прорабатывал. Прошу сильно не ругать(

## В таблице с тасками не реализована строка Sum
\>_<