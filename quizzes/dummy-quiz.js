quiz = {
    "info": {
        "name":    "",
        "main":    "Тест по информатике.",
        "level1":  "Отлично",
        "level2":  "Хорошо",
        "level3":  "Удовлетворительно",
        "level4":  "Плохо",
        "level5":  "Bruh..." // no comma here
    },
    "questions": [
        { // Question 1 - Multiple Choice, Single True Answer
            "q": "Обратимое преобразование информации в целях сокрытия:",
            "a": [
                {"option": "искажение",        "correct": false},
                {"option": "шифрование",       "correct": true},
                {"option": "дешифрование",     "correct": false},
                {"option": "реверсирование",   "correct": false} // no comma here
            ],
            "correct": "<p class='text-success'><b>Правильно!</b></p>",
            "incorrect": "<p class='text-danger'><b>Неправильно!</b></p>" // no comma here
        },
        { // Question 2 - Multiple Choice, Multiple True Answers, Select Any
            "q": "Какое животное является логотипом Linux?",
            "a": [
                {"option": "<img src='img/bear.jpg'>",     "correct": false},
                {"option": "<img src='img/hedgehog.jpg'>", "correct": false},
                {"option": "<img src='img/ping.jpg'>",     "correct": true},
                {"option": "<img src='img/hare.jpg'>",     "correct": false},
            ],
            "correct": "<p class='text-success'><b>Правильно!</b></p>",
            "incorrect": "<p class='text-danger'><b>Неправильно!</b></p>" // no comma here
        },
        { // Question 3 - Multiple Choice, Multiple True Answers, Select All
            "q": "Что из перечисленного <span class='text-danger'>не</span> является составным элементом компьютера:",
            "a": [
                {"option": "мaтepинcĸaя плaтa",   "correct": false},
                {"option": "генератор",           "correct": true},
                {"option": "процессор",           "correct": false},
                {"option": "подвеска",            "correct": true} // no comma here
            ],
            "correct": "<p class='text-success'><b>Правильно!</b></p>",
            "incorrect": "<p class='text-danger'><b>Неправильно!</b></p>" // no comma here
        }
    ]
};
