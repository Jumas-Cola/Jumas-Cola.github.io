---
layout: page
title: О сайте
permalink: /about/
---

<p>
    Сайт для выполнения лабораторной работы "Основы работы с HTML и принципы сайтостроения".
</p>
<h5>План лабораторной работы:<h5>
<p>
Создать небольшой Web-сайт на свободную тему, предварительно согласовав ее с преподавателем. Сайт должен включать:
</p>
<ol>
    <li>Не менее пяти-семи веб-страниц;</li>
    <li>Элементы, написанные на DHTML и JavaScript;</li>
    <li>Анимированные баннеры из лабораторной работы 2;</li>
    <li>Каскадные таблицы стилей. (CSS)</li>
</ol>

<button class="btn btn-info" type="button" id="button">
Подписаться на рассылку
</button>

<script>
document.getElementById('button').addEventListener("click", () => {
    const btn = document.getElementById('button');
    btn.classList.add('rotate');
    setTimeout(() => {
        btn.classList.remove('rotate');
    }, 1000);
});
</script>

<style>
.rotate {
    -webkit-animation:spin 1s linear infinite;
    -moz-animation:spin 1s linear infinite;
    animation:spin 1s linear infinite;
}
@-moz-keyframes spin {
    100% { -moz-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
    100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
    100% {
        -webkit-transform: rotate(360deg);
        transform:rotate(360deg);
    }
}
</style>
