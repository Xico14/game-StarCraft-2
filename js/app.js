let app = new Vue({
    // элемент для работы
    el: '.main',
    data: {
        // Скрытие/Показ экранов
        showMain: true,
        showSocial: false,
        showAchivments: false,
        showQuestions:false,
        showResult: false,
        // нумирация вопроса
        number: 0,
        // счет за рассу
        score: {
            'zerg': 0,
            'primal': 0,
            'protoss': 0,
            'taldarim': 0,
            'terran': 0,
        },
        // Кол-во игр за каждую расу
        totalGame: localStorage.getItem('sc2TotalGame') ? JSON.parse(localStorage.getItem('sc2TotalGame')) : {
            'zerg': 0,
            'primal': 0,
            'protoss': 0,
            'taldarim': 0,
            'terran': 0,
            'infested': 0,
            'hybrid': 0,
        },
        totalGames: localStorage.getItem('sc2TotalGames') ? localStorage.getItem('sc2TotalGames') : 0,
        questions: questions,
        results: results,
        resultRace: 'infested',
    },
    // методы 
    methods: {
        // отображение main
        goToMain() {
            this.showMain = true
            this.showSocial = false
            this.showAchivments = false
            this.showQuestions = false
            this.showResult = false
        },
        // отображение social
        goToSocial() {
            this.showMain = false
            this.showSocial = true
            this.showAchivments = false
            this.showQuestions = false
            this.showResult = false
        },
        // отображение достижений
        goToAchivments() {
            if(this.totalGames > 0) {
                this.showMain = false
                this.showSocial = false
                this.showAchivments = true
                this.showQuestions = false
                this.showResult = false
            } else {
                this.goToQuestions()
            } 
        },
        // отображение игровой страницы
        goToQuestions() {
            this.score = {
                'zerg': 0,
                'primal': 0,
                'protoss': 0,
                'taldarim': 0,
                'terran': 0,
            }
            this.showMain = false
            this.showSocial = false
            this.showAchivments = false
            this.showQuestions = true
            this.showResult = false
        },
        // отображение результатов
        goToResult(race) {
            this.showMain = false
            this.showSocial = false
            this.showAchivments = false
            this.showQuestions = false
            this.showResult = true
            this.resultRace = race
        },
        // цикл переключения вопросов и ответов
        nextQuestions(answer) {
            if(this.number == 24) {
                this.number = 0
                this.endGame();
            } else {
                this.number++
            }
            eval(answer);
        },
        // Конец вопросов выход в достижения
        endGame() {
            this.totalGames++;
            localStorage.setItem('sc2TotalGames', this.totalGames)
            // зерг
            if(this.score.zerg > this.score.protoss && this.score.zerg > this.score.terran && this.score.primal < 8 && Math.abs(this.score.protoss - this.score.zerg) < 8) {
                this.goToResult('zerg');
                this.totalGame.zerg++;
            }
            // Изначальный зерг
            else if(this.score.primal > this.score.protoss && this.score.primal > this.score.terran && this.score.primal == 8) {
                this.goToResult('primal');
                this.totalGame.primal++;
            }
            // Протосс
            else if(this.score.protoss > this.score.zerg && this.score.protoss > this.score.terran && this.score.taldarim < 5 && Math.abs(this.score.protoss - this.score.zerg) > 3) {
                this.goToResult('protoss');
                this.totalGame.protoss++;
            }
            // Талдарим
            else if(this.score.protoss > this.score.zerg && this.score.protoss > this.score.terran && this.score.taldarim == 5) {
                this.goToResult('taldarim');
                this.totalGame.taldarim++;
            }
            // Терран
            else if(this.score.terran > this.score.zerg && this.score.terran > this.score.protoss) {
                this.goToResult('terran');
                this.totalGame.terran++;
            }
            // Гибрид
            else if(Math.abs(this.score.protoss - this.score.zerg) <= 3) {
                this.goToResult('hybrid');
                this.totalGame.hybrid++;
            }
            // Зараженный Терран
            else {
                this.goToResult('infested');
                this.totalGame.infested++;
            }
            localStorage.setItem('sc2TotalGame', JSON.stringify(this.totalGame))
        }
    },
    // подсчет результатов
    computed: {
        // Вычисление общего счета
        totalScore () {
            let score = 0;
            for(let i in results) {
                    score += (this.totalGame[i] * results[i]['points']);
                    // console.log(results[i]['points'])
                    // console.log(this.totalGame[i])
            }
            // console.log(score)
            return score;
        },
        // Вычисление открытых рас
        openRaces () {
            let count = 0;
            for(let i in this.totalGame) {
                    if(this.totalGame[i]>0) count++
            }
            return count;
        },
        // Вычисление любимых рас
        favoriteRase () {
            let max = 'zerg';
            for(let i in this.totalGame) {
                if(this.totalGame[i]>this.totalGame[max]) {
                    max = i;
                }
            }
            return results[max].name;
        },
        // скрыть показать результат по расам
        showResultRace () {
            return {
                'zerg':this.totalGame.zerg>0?true:false,
                'primal':this.totalGame.primal>0?true:false,
                'protoss':this.totalGame.protoss>0?true:false,
                'taldarim':this.totalGame.taldarim>0?true:false,
                'terran':this.totalGame.terran>0?true:false,
                'hybrid':this.totalGame.hybrid>0?true:false,
                'infested':this.totalGame.infested>0?true:false


            }
        }
        
    }
})