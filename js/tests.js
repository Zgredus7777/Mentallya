document.addEventListener('DOMContentLoaded', function() {
    initTestFilters();
    loadTests();
});

function initTestFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterTests(this.getAttribute('data-filter'));
        });
    });
}

function filterTests(filter) {
    const testCards = document.querySelectorAll('.test-card');
    if (!testCards) return;
    
    testCards.forEach(card => {
        switch(filter) {
            case 'all':
                card.style.display = 'block';
                break;
            case 'free':
                if (card.classList.contains('premium')) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
                }
                break;
            case 'premium':
                if (card.classList.contains('premium')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                break;
        }
    });
}

function loadTests() {
    const testsGrid = document.querySelector('.tests-grid');
    if (!testsGrid) return;
    
    const tests = [
        {
            id: 'phq9',
            title: 'Test depresji (PHQ-9)',
            description: '9-punktowy kwestionariusz zdrowia pacjenta do oceny objawów depresji.',
            time: '5 min',
            premium: false
        },
        {
            id: 'gad7',
            title: 'Test lęku (GAD-7)',
            description: '7-punktowa skala uogólnionego zaburzenia lękowego do oceny poziomu lęku.',
            time: '3 min',
            premium: true
        },
        {
            id: 'pss10',
            title: 'Test stresu (PSS-10)',
            description: '10-punktowa skala odczuwanego stresu, mierząca subiektywne odczucie stresu.',
            time: '5 min',
            premium: true
        },
        {
            id: 'audit',
            title: 'Test uzależnienia od alkoholu (AUDIT)',
            description: 'Narzędzie przesiewowe do identyfikacji ryzykownych i szkodliwych wzorców picia alkoholu.',
            time: '5 min',
            premium: false
        },
        {
            id: 'bigfive',
            title: 'Test osobowości (Big Five)',
            description: 'Ocena pięciu głównych wymiarów osobowości: otwartość, sumienność, ekstrawersja, ugodowość, neurotyczność.',
            time: '15 min',
            premium: true
        },
        {
            id: 'adhd',
            title: 'Test ADHD u dorosłych',
            description: 'Skala samooceny objawów ADHD u dorosłych (ASRS v1.1) .',
            time: '3 min',
            premium: true
        },
        {
            id: 'mmse',
            title: 'Mini-Mental State Examination (MMSE)',
            description: 'Badanie przesiewowe funkcji poznawczych, stosowane w ocenie otępienia.',
            time: '10 min',
            premium: true
        }
    ];
    
    testsGrid.innerHTML = '';
    
    tests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = `test-card ${test.premium ? 'premium' : ''}`;
        testCard.innerHTML = `
            <div class="test-image">🧠</div>
            <div class="test-content">
                <h3>${test.title}</h3>
                <p>${test.description}</p>
                <div class="test-meta">
                    <span>${test.questions} pytania</span>
                    <span>${test.time}</span>
                </div>
                <button class="btn start-test" data-test="${test.id}">Rozpocznij test</button>
            </div>
        `;
        testsGrid.appendChild(testCard);
    });
    
    document.querySelectorAll('.start-test').forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.getAttribute('data-test');
            startTest(testId);
        });
    });
}

function startTest(testId) {
    const testModal = document.getElementById('testModal');
    if (!testModal) return;
    
    showLoading();
    
    setTimeout(() => {
        switch(testId) {
            case 'phq9':
                loadPHQ9Test();
                break;
            case 'gad7':
                loadGAD7Test();
                break;
            case 'pss10':
                loadPSSTest();
                break;
            case 'audit':
                loadAUDITTest();
                break;
            case 'bigfive':
                checkPremiumAccess(() => loadBigFiveTest());
                break;
            case 'adhd':
                checkPremiumAccess(() => loadADHDTest());
                break;
            case 'mmse':
                checkPremiumAccess(() => loadMMSETest());
                break;
            default:
                loadGenericTest(testId);
        }
        
        openModal(testModal);
        hideLoading();
    }, 1000);
}

function loadPHQ9Test() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = `
        <h3>Test depresji (PHQ-9)</h3>
        <p>Proszę ocenić jak często w ciągu ostatnich 2 tygodni doświadczał(a) Pan(i) poniższych problemów:</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Małe zainteresowanie lub przyjemność z wykonywania różnych czynności</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q1" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q1" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q1" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q1" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">2. Obniżony nastrój, uczucie przygnębienia, beznadziejności</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q2" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q2" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q2" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q2" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">3. Problemy z zasypianiem lub przesypianiem całej nocy, lub zbyt długie spanie</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q3" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q3" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q3" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q3" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">4. Uczucie zmęczenia lub brak energii</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q4" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q4" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q4" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q4" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">5. Słaby apetyt lub przejadanie się</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q5" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q5" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q5" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q5" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">6. Uczucie, że jest się złym człowiekiem lub że zawiodło się siebie lub rodzinę</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q6" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q6" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q6" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q6" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">7. Trudności z koncentracją na codziennych czynnościach, takich jak czytanie gazety lub oglądanie telewizji</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q7" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q7" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q7" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q7" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">8. Poruszanie się lub mówienie tak wolno, że inni mogliby to zauważyć lub przeciwnie - bycie tak niespokojnym lub pobudzonym, że porusza się Pan(i) więcej niż zwykle</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q8" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q8" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q8" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q8" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">9. Myśli o tym, że lepiej byłoby umrzeć lub o zrobieniu sobie krzywdy</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q9" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q9" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q9" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q9" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;

    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let score = 0;
        for (let i = 1; i <= 9; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) score += parseInt(selectedOption.value);
        }
        
        let interpretation = "";
        if (score >= 20) interpretation = "Ciężka depresja - pilnie skonsultuj się ze specjalistą";
        else if (score >= 15) interpretation = "Umiarkowanie ciężka depresja";
        else if (score >= 10) interpretation = "Umiarkowana depresja";
        else if (score >= 5) interpretation = "Łagodna depresja";
        else interpretation = "Brak istotnych objawów depresji";
        
        showTestResult('phq9', score, interpretation);
    });
}

function loadGAD7Test() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = `
        <h3>Test lęku uogólnionego (GAD-7)</h3>
        <p>Proszę ocenić jak często w ciągu ostatnich 2 tygodni doświadczał(a) Pan(i) poniższych problemów:</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Uczucie nerwowości, niepokoju lub napięcia</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q1" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q1" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q1" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q1" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">2. Niemożność powstrzymania się lub kontrolowania zamartwiania</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q2" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q2" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q2" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q2" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">3. Nadmierne zamartwianie się różnymi sprawami</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q3" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q3" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q3" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q3" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">4. Trudności z odprężeniem się</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q4" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q4" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q4" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q4" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">5. Takie pobudzenie, że trudno jest usiedzieć w miejscu</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q5" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q5" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q5" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q5" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">6. Łatwe wpadanie w irytację lub poirytowanie</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q6" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q6" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q6" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q6" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">7. Uczucie strachu, jakby coś strasznego miało się wydarzyć</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q7" value="0" required> Wcale</label>
                    <label class="option"><input type="radio" name="q7" value="1"> Kilka dni</label>
                    <label class="option"><input type="radio" name="q7" value="2"> Ponad połowę dni</label>
                    <label class="option"><input type="radio" name="q7" value="3"> Prawie codziennie</label>
                </div>
            </div>
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;

    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let score = 0;
        for (let i = 1; i <= 7; i++) {
            score += parseInt(document.querySelector(`input[name="q${i}"]:checked`).value);
        }
        
        let interpretation = "";
        if (score >= 15) interpretation = "Prawdopodobnie ciężkie zaburzenie lękowe";
        else if (score >= 10) interpretation = "Umiarkowane zaburzenie lękowe";
        else if (score >= 5) interpretation = "Łagodne zaburzenie lękowe";
        else interpretation = "Minimalny lęk";
        
        showTestResult('gad7', score, interpretation);
    });
}

function loadBigFiveTest() {
    const questions = [
        "1. Jestem osobą towarzyską",
        "2. Lubię pomagać innym",
        "3. Wykonuję swoje obowiązki starannie",
        "4. Często odczuwam stres",
        "5. Mam bogatą wyobraźnię",
        "6. Jestem zamknięty w sobie (R)",
        "7. Ufam innym ludziom",
        "8. Często odkładam rzeczy na później (R)",
        "9. Rzadko się martwię",
        "10. Lubię poznawać nowe rzeczy",
        "11. Energicznie wyrażam emocje",
        "12. Unikam konfliktów",
        "13. Jestem osobą pracowitą",
        "14. Łatwo wpadam w przygnębienie",
        "15. Preferuję rutynę niż zmiany (R)",
        "16. Lubię być w centrum uwagi",
        "17. Mam łagodne usposobienie",
        "18. Systematycznie realizuję swoje plany",
        "19. Łatwo się denerwuję",
        "20. Lubię analizować abstrakcyjne idee",
        "21. Nie lubię zwracać na siebie uwagi (R)",
        "22. Współczuję bezdomnym",
        "23. Często zapominam o oddawaniu rzeczy na miejsce (R)",
        "24. Jestem zrównoważony emocjonalnie",
        "25. Jestem mało kreatywny (R)",
        "26. Mam zdolności przywódcze",
        "27. Rozumiem uczucia innych",
        "28. Zawsze sprzątam po sobie",
        "29. Często czuję się przygnębiony",
        "30. Jestem ciekawy świata",
        "31. Nie lubię być w centrum uwagi (R)",
        "32. Szybko pocieszam innych",
        "33. Robię rzeczy spontanicznie (R)",
        "34. Jestem wrażliwy na stres",
        "35. Lubię bawić się nowymi pomysłami",
        "36. Mam niewiele do powiedzenia (R)",
        "37. Uważam, że ludzie są z natury dobrzy",
        "38. Trzymam wszystko w idealnym porządku",
        "39. Często czuję się niepewnie",
        "40. Doceniam sztukę",
        "41. Czuję się niekomfortowo wśród ludzi (R)",
        "42. Chętnie słucham problemów innych",
        "43. Często zapominam o swoich obowiązkach (R)",
        "44. Łatwo się denerwuję",
        "45. Mam głębokie przemyślenia",
        "46. Jestem pełen energii w towarzystwie",
        "47. Unikam dyskusji o moralności (R)",
        "48. Starannie planuję swoje działania",
        "49. Często czuję się zdenerwowany",
        "50. Lubię rozważać teoretyczne problemy"
    ];

    let formHTML = `<h3>Test osobowości Big Five</h3>
                   <p>Proszę odpowiedzieć na poniższe pytania dotyczące Twoich typowych zachowań i preferencji:</p>
                   <div class="test-progress">
                       <div class="progress-bar" style="width: 0%"></div>
                   </div>
                   <form id="testForm">`;
    
    questions.forEach((question, index) => {
        formHTML += `
            <div class="question">
                <p class="question-text">${question}</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q${index+1}" value="1" required> Zdecydowanie nie zgadzam się</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="2"> Raczej nie zgadzam się</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="3"> Neutralnie</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="4"> Raczej zgadzam się</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="5"> Zdecydowanie zgadzam się</label>
                </div>
            </div>
        `;
    });

    formHTML += `
        <div class="test-nav">
            <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
            <button type="submit" class="btn">Zakończ test</button>
        </div>
        </form>
    `;

    document.getElementById('testContent').innerHTML = formHTML;

    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const traits = {
            extraversion: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
            agreeableness: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
            conscientiousness: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
            neuroticism: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
            openness: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
        };

        const results = {};
        for (const trait in traits) {
            results[trait] = traits[trait].reduce((sum, qNum) => {
                const value = parseInt(document.querySelector(`input[name="q${qNum}"]:checked`).value);
                const isReversed = document.querySelector(`.question:nth-child(${qNum}) .question-text`).textContent.includes('(R)');
                return sum + (isReversed ? (6 - value) : value);
            }, 0);
        }

        showBigFiveResult(results);
    });
}

function loadADHDTest() {
    const questions = [
        "1. Jak często zdarza się Panu(i) mieć trudności z kończeniem ostatnich szczegółów pracy, gdy już została wykonana najtrudniejsza jej część?",
        "2. Jak często zdarza się Panu(i) mieć trudności z uporządkowaniem pracy, gdy zadanie wymaga zorganizowania się?",
        "3. Jak często zdarza się Panu(i) zapominać o umówionych spotkaniach lub zaplanowanych obowiązkach?",
        "4. Jak często zdarza się Panu(i) unikać zadania lub odkładać je na później, gdy wymaga ono dużego wysiłku umysłowego?",
        "5. Jak często zdarza się Panu(i) wiercić się lub bawić rękami lub stopami, gdy musi Pan(i) usiedzieć długo w miejscu?",
        "6. Jak często zdarza się Panu(i) czuć się nadmiernie aktywnym(-ą) i zmuszonym(-ą) do robienia czegoś, jakby Pan(i) 'napędzany(-a) przez motor'?",
        "7. Jak często zdarza się Panu(i) popełniać nieostrożne błędy, gdy musi się Pan(i) zajmować nudnym lub trudnym zadaniem?",
        "8. Jak często zdarza się Panu(i) mieć trudności z koncentracją na tym, co mówią inni, nawet gdy mówią bezpośrednio do Pana(i)?",
        "9. Jak często zdarza się Panu(i) gubić lub nie móc znaleźć rzeczy w domu lub w pracy?",
        "10. Jak często zdarza się Panu(i) być rozpraszanym(-ą) przez aktywność lub dźwięki w otoczeniu?",
        "11. Jak często zdarza się Panu(i) wychodzić z miejsca na spotkaniach lub w innych sytuacjach, gdy oczekuje się, że pozostanie Pan(i) na miejscu?",
        "12. Jak często zdarza się Panu(i) czuć się niespokojnym(-ą) lub niecierpliwym(-ą)?",
        "13. Jak często zdarza się Panu(i) czuć się nie na miejscu w czasie wolnym lub odpoczywając?",
        "14. Jak często zdarza się Panu(i) podejmować się zbyt wielu zadań jednocześnie?",
        "15. Jak często zdarza się Panu(i) mieć trudności z oczekiwaniem na swoją kolej, np. w kolejce?",
        "16. Jak często zdarza się Panu(i) przerywać innym, gdy są zajęci?",
        "17. Jak często zdarza się Panu(i) mieć trudności z relaksowaniem się w czasie wolnym?",
        "18. Jak często zdarza się Panu(i) mówić nadmiernie w sytuacjach towarzyskich?"
    ];

    let formHTML = `<h3>Test ADHD u dorosłych (ASRS v1.1)</h3>
                   <p>Proszę odpowiedzieć na poniższe pytania dotyczące Twoich typowych zachowań w ciągu ostatnich 6 miesięcy:</p>
                   <div class="test-progress">
                       <div class="progress-bar" style="width: 0%"></div>
                   </div>
                   <form id="testForm">`;
    
    questions.forEach((question, index) => {
        formHTML += `
            <div class="question">
                <p class="question-text">${question}</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q${index+1}" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="1"> Rzadko</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="3"> Często</label>
                    <label class="option"><input type="radio" name="q${index+1}" value="4"> Bardzo często</label>
                </div>
            </div>
        `;
    });

    formHTML += `
        <div class="test-nav">
            <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
            <button type="submit" class="btn">Zakończ test</button>
        </div>
        </form>
    `;

    document.getElementById('testContent').innerHTML = formHTML;

    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let score = 0;
        for (let i = 1; i <= 18; i++) {
            score += parseInt(document.querySelector(`input[name="q${i}"]:checked`).value);
        }
        
        let interpretation = "";
        if (score >= 36) interpretation = "Wysokie prawdopodobieństwo ADHD - zalecana konsultacja specjalistyczna";
        else if (score >= 24) interpretation = "Średnie prawdopodobieństwo ADHD";
        else interpretation = "Niskie prawdopodobieństwo ADHD";
        
        showTestResult('adhd', score, interpretation);
    });
}

function loadPSSTest() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = `
        <h3>Skala Odczuwanego Stresu (PSS-10)</h3>
        <p>Proszę wskazać, jak często w ciągu ostatniego miesiąca:</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Był(a) Pan(i) zaskoczony(a) czymś nieprzyjemnym?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q1" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q1" value="1"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q1" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q1" value="3"> Dość często</label>
                    <label class="option"><input type="radio" name="q1" value="4"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">2. Czul(a) się Pan(i), że nie jest w stanie kontrolować ważnych spraw w swoim życiu?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q2" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q2" value="1"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q2" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q2" value="3"> Dość często</label>
                    <label class="option"><input type="radio" name="q2" value="4"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">3. Czul(a) się Pan(i) zdenerwowany(a) i zestresowany(a)?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q3" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q3" value="1"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q3" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q3" value="3"> Dość często</label>
                    <label class="option"><input type="radio" name="q3" value="4"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">4. Czul(a) się Pan(i) pewny(a) swojej zdolności do radzenia sobie z osobistymi problemami?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q4" value="4" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q4" value="3"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q4" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q4" value="1"> Dość często</label>
                    <label class="option"><input type="radio" name="q4" value="0"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">5. Czul(a) się Pan(i), że sprawy układają się po Pana(i) myśli?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q5" value="4" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q5" value="3"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q5" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q5" value="1"> Dość często</label>
                    <label class="option"><input type="radio" name="q5" value="0"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">6. Czul(a) się Pan(i), że nie jest w stanie podołać wszystkim rzeczom, które musi Pan(i) zrobić?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q6" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q6" value="1"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q6" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q6" value="3"> Dość często</label>
                    <label class="option"><input type="radio" name="q6" value="4"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">7. Czul(a) się Pan(i) zdolny(a) do kontrolowania irytacji w swoim życiu?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q7" value="4" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q7" value="3"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q7" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q7" value="1"> Dość często</label>
                    <label class="option"><input type="radio" name="q7" value="0"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">8. Czul(a) się Pan(i), że panuje nad wszystkim?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q8" value="4" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q8" value="3"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q8" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q8" value="1"> Dość często</label>
                    <label class="option"><input type="radio" name="q8" value="0"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">9. Był(a) Pan(i) zły/ zła z powodu rzeczy, które działy się poza Pana(i) kontrolą?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q9" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q9" value="1"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q9" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q9" value="3"> Dość często</label>
                    <label class="option"><input type="radio" name="q9" value="4"> Bardzo często</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">10. Czul(a) się Pan(i), że trudności narastają tak bardzo, że nie jest w stanie ich przezwyciężyć?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q10" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q10" value="1"> Prawie nigdy</label>
                    <label class="option"><input type="radio" name="q10" value="2"> Czasami</label>
                    <label class="option"><input type="radio" name="q10" value="3"> Dość często</label>
                    <label class="option"><input type="radio" name="q10" value="4"> Bardzo często</label>
                </div>
            </div>
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;

    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let score = 0;
        for (let i = 1; i <= 10; i++) {
            score += parseInt(document.querySelector(`input[name="q${i}"]:checked`).value);
        }
        
        let interpretation = "";
        if (score >= 27) interpretation = "Bardzo wysoki poziom odczuwanego stresu";
        else if (score >= 20) interpretation = "Wysoki poziom odczuwanego stresu";
        else if (score >= 14) interpretation = "Średni poziom odczuwanego stresu";
        else interpretation = "Niski poziom odczuwanego stresu";
        
        showTestResult('pss10', score, interpretation);
    });
}

function loadAUDITTest() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = `
        <h3>Test uzależnienia od alkoholu (AUDIT)</h3>
        <p>Proszę odpowiedzieć na pytania dotyczące spożywania alkoholu w ciągu ostatniego roku:</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Jak często Pan(i) pije napoje alkoholowe?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q1" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q1" value="1"> Raz w miesiącu lub rzadziej</label>
                    <label class="option"><input type="radio" name="q1" value="2"> 2-4 razy w miesiącu</label>
                    <label class="option"><input type="radio" name="q1" value="3"> 2-3 razy w tygodniu</label>
                    <label class="option"><input type="radio" name="q1" value="4"> 4 lub więcej razy w tygodniu</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">2. Ile standardowych porcji alkoholu wypija Pan(i) w typowy dzień, w którym Pan(i) pije?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q2" value="0" required> 1-2</label>
                    <label class="option"><input type="radio" name="q2" value="1"> 3-4</label>
                    <label class="option"><input type="radio" name="q2" value="2"> 5-6</label>
                    <label class="option"><input type="radio" name="q2" value="3"> 7-9</label>
                    <label class="option"><input type="radio" name="q2" value="4"> 10 lub więcej</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">3. Jak często wypija Pan(i) 6 lub więcej porcji alkoholu podczas jednej okazji?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q3" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q3" value="1"> Rzadziej niż raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q3" value="2"> Raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q3" value="3"> Raz w tygodniu</label>
                    <label class="option"><input type="radio" name="q3" value="4"> Codziennie lub prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">4. Jak często w ciągu ostatniego roku zdarzało się Panu(i), że po rozpoczęciu picia nie mógł(-a) Pan(i) przestać?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q4" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q4" value="1"> Rzadziej niż raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q4" value="2"> Raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q4" value="3"> Raz w tygodniu</label>
                    <label class="option"><input type="radio" name="q4" value="4"> Codziennie lub prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">5. Jak często w ciągu ostatniego roku z powodu picia alkoholu zaniedbywał(-a) Pan(i) swoje zwyczajowe obowiązki?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q5" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q5" value="1"> Rzadziej niż raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q5" value="2"> Raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q5" value="3"> Raz w tygodniu</label>
                    <label class="option"><input type="radio" name="q5" value="4"> Codziennie lub prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">6. Jak często w ciągu ostatniego roku musiał(-a) Pan(i) napić się alkoholu rano, aby dojść do siebie po piciu dnia poprzedniego?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q6" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q6" value="1"> Rzadziej niż raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q6" value="2"> Raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q6" value="3"> Raz w tygodniu</label>
                    <label class="option"><input type="radio" name="q6" value="4"> Codziennie lub prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">7. Jak często w ciągu ostatniego roku miał(-a) Pan(i) poczucie winy lub wyrzuty sumienia po piciu alkoholu?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q7" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q7" value="1"> Rzadziej niż raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q7" value="2"> Raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q7" value="3"> Raz w tygodniu</label>
                    <label class="option"><input type="radio" name="q7" value="4"> Codziennie lub prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">8. Jak często w ciągu ostatniego roku nie mógł(-a) Pan(i) przypomnieć sobie, co się zdarzyło poprzedniego dnia lub nocy z powodu picia alkoholu?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q8" value="0" required> Nigdy</label>
                    <label class="option"><input type="radio" name="q8" value="1"> Rzadziej niż raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q8" value="2"> Raz w miesiącu</label>
                    <label class="option"><input type="radio" name="q8" value="3"> Raz w tygodniu</label>
                    <label class="option"><input type="radio" name="q8" value="4"> Codziennie lub prawie codziennie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">9. Czy Pan(i) lub ktoś inny doznał urazu fizycznego w wyniku Pana(i) picia?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q9" value="0" required> Nie</label>
                    <label class="option"><input type="radio" name="q9" value="4"> Tak, ale nie w ciągu ostatniego roku</label>
                    <label class="option"><input type="radio" name="q9" value="5"> Tak, w ciągu ostatniego roku</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">10. Czy krewny, przyjaciel, lekarz lub inna osoba z personelu medycznego interesował się Pana(i) piciem lub sugerował jego ograniczenie?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q10" value="0" required> Nie</label>
                    <label class="option"><input type="radio" name="q10" value="4"> Tak, ale nie w ciągu ostatniego roku</label>
                    <label class="option"><input type="radio" name="q10" value="5"> Tak, w ciągu ostatniego roku</label>
                </div>
            </div>
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;

    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let score = 0;
        for (let i = 1; i <= 10; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) score += parseInt(selectedOption.value);
        }
        
        let interpretation = "";
        if (score >= 20) interpretation = "Prawdopodobne uzależnienie od alkoholu - zalecana konsultacja specjalistyczna";
        else if (score >= 15) interpretation = "Wysokie ryzyko szkodliwego picia";
        else if (score >= 8) interpretation = "Ryzykowne picie";
        else interpretation = "Niskie ryzyko";
        
        showTestResult('audit', score, interpretation);
    });
}

function loadMMSETest() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = `
        <h3>Mini-Mental State Examination (MMSE)</h3>
        <p>Proszę odpowiedzieć na pytania i wykonać zadania:</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Orientacja w czasie: Jaki mamy rok? Który miesiąc? Jaki dzień tygodnia? Jaka data?</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q1" value="0" required> 0 poprawnych odpowiedzi</label>
                    <label class="option"><input type="radio" name="q1" value="1"> 1 poprawna odpowiedź</label>
                    <label class="option"><input type="radio" name="q1" value="2"> 2 poprawne odpowiedzi</label>
                    <label class="option"><input type="radio" name="q1" value="3"> 3 poprawne odpowiedzi</label>
                    <label class="option"><input type="radio" name="q1" value="4"> 4 poprawne odpowiedzi</label>
                    <label class="option"><input type="radio" name="q1" value="5"> 5 poprawnych odpowiedzi</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">2. Orientacja w miejscu: Gdzie się teraz znajdujemy? (kraj, województwo, miasto, instytucja, piętro)</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q2" value="0" required> 0 poprawnych odpowiedzi</label>
                    <label class="option"><input type="radio" name="q2" value="1"> 1 poprawna odpowiedź</label>
                    <label class="option"><input type="radio" name="q2" value="2"> 2 poprawne odpowiedzi</label>
                    <label class="option"><input type="radio" name="q2" value="3"> 3 poprawne odpowiedzi</label>
                    <label class="option"><input type="radio" name="q2" value="4"> 4 poprawne odpowiedzi</label>
                    <label class="option"><input type="radio" name="q2" value="5"> 5 poprawnych odpowiedzi</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">3. Rejestracja: Proszę powtórzyć trzy słowa: jabłko, stół, moneta</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q3" value="0" required> Żadnego słowa</label>
                    <label class="option"><input type="radio" name="q3" value="1"> Jedno słowo</label>
                    <label class="option"><input type="radio" name="q3" value="2"> Dwa słowa</label>
                    <label class="option"><input type="radio" name="q3" value="3"> Trzy słowa</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">4. Uwaga i koncentracja: Proszę odliczać od 100 co 7 (100, 93, 86, 79, 72, 65)</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q4" value="0" required> 0 poprawnych</label>
                    <label class="option"><input type="radio" name="q4" value="1"> 1 poprawna</label>
                    <label class="option"><input type="radio" name="q4" value="2"> 2 poprawne</label>
                    <label class="option"><input type="radio" name="q4" value="3"> 3 poprawne</label>
                    <label class="option"><input type="radio" name="q4" value="4"> 4 poprawne</label>
                    <label class="option"><input type="radio" name="q4" value="5"> 5 poprawnych</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">5. Pamięć: Proszę przypomnieć sobie trzy słowa z pytania 3</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q5" value="0" required> Żadnego słowa</label>
                    <label class="option"><input type="radio" name="q5" value="1"> Jedno słowo</label>
                    <label class="option"><input type="radio" name="q5" value="2"> Dwa słowa</label>
                    <label class="option"><input type="radio" name="q5" value="3"> Trzy słowa</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">6. Mowa: Proszę nazwać przedmiot pokazany na obrazku (np. zegarek, ołówek)</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q6" value="0" required> Niepoprawnie</label>
                    <label class="option"><input type="radio" name="q6" value="1"> Poprawnie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">7. Powtarzanie: Proszę powtórzyć zdanie: 'Żadnych gdybań, zakłóceń albo ale'</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q7" value="0" required> Niepoprawnie</label>
                    <label class="option"><input type="radio" name="q7" value="1"> Poprawnie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">8. Rozumienie: Proszę wykonać trzyetapowe polecenie: 'Weź kartkę papieru w prawą rękę, złóż ją na pół i połóż na podłodze'</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q8" value="0" required> Żadnego polecenia</label>
                    <label class="option"><input type="radio" name="q8" value="1"> Jedno polecenie</label>
                    <label class="option"><input type="radio" name="q8" value="2"> Dwa polecenia</label>
                    <label class="option"><input type="radio" name="q8" value="3"> Trzy polecenia</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">9. Czytanie: Proszę przeczytać i wykonać polecenie: 'Zamknij oczy'</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q9" value="0" required> Nie wykonał</label>
                    <label class="option"><input type="radio" name="q9" value="1"> Wykonał</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">10. Pisanie: Proszę napisać zdanie (pełne, z podmiotem i orzeczeniem)</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q10" value="0" required> Niepoprawnie</label>
                    <label class="option"><input type="radio" name="q10" value="1"> Poprawnie</label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">11. Rysowanie: Proszę narysować dwa przecinające się pięciokąty</p>
                <div class="options">
                    <label class="option"><input type="radio" name="q11" value="0" required> Niepoprawnie</label>
                    <label class="option"><input type="radio" name="q11" value="1"> Poprawnie</label>
                </div>
            </div>
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;

    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let score = 0;
        for (let i = 1; i <= 11; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) score += parseInt(selectedOption.value);
        }
        
        let interpretation = "";
        if (score >= 27) interpretation = "Prawidłowy wynik, brak zaburzeń poznawczych";
        else if (score >= 24) interpretation = "Łagodne zaburzenia poznawcze";
        else if (score >= 18) interpretation = "Umiarkowane zaburzenia poznawcze";
        else interpretation = "Ciężkie zaburzenia poznawcze";
        
        showTestResult('mmse', score, interpretation);
    });
}

function showTestResult(testId, score, interpretation) {
    const testContent = document.getElementById('testContent');
    if (!testContent) return;
    
    let resultText = '';
    let description = '';
    
    switch(testId) {
        case 'phq9':
            if (score >= 0 && score <= 4) {
                resultText = 'Brak lub minimalne objawy depresji';
            } else if (score >= 5 && score <= 9) {
                resultText = 'Łagodna depresja';
            } else if (score >= 10 && score <= 14) {
                resultText = 'Umiarkowana depresja';
            } else if (score >= 15 && score <= 19) {
                resultText = 'Umiarkowanie ciężka depresja';
            } else {
                resultText = 'Ciężka depresja';
            }
            
            description = 'PHQ-9 jest narzędziem przesiewowym i nie stanowi diagnozy. Wynik wskazujący na depresję wymaga konsultacji ze specjalistą.';
            break;
        case 'gad7':
            resultText = score <= 4 ? 'Minimalny lęk' : 
                        score <= 9 ? 'Łagodny lęk' : 
                        score <= 14 ? 'Umiarkowany lęk' : 'Ciężki lęk';
            description = 'GAD-7 to narzędzie przesiewowe. Wynik wskazujący na lęk wymaga konsultacji ze specjalistą.';
            break;
        case 'pss10':
            if (score >= 27) resultText = "Bardzo wysoki poziom stresu";
            else if (score >= 20) resultText = "Wysoki poziom stresu";
            else if (score >= 14) resultText = "Średni poziom stresu";
            else resultText = "Niski poziom stresu";
            description = 'PSS-10 mierzy subiektywne odczucie stresu. Wysoki wynik może wskazywać na potrzebę wprowadzenia technik radzenia sobie ze stresem.';
            break;
        case 'audit':
            if (score >= 20) resultText = "Prawdopodobne uzależnienie od alkoholu";
            else if (score >= 15) resultText = "Wysokie ryzyko szkodliwego picia";
            else if (score >= 8) resultText = "Ryzykowne picie";
            else resultText = "Niskie ryzyko";
            description = 'Wynik AUDIT wskazuje na poziom ryzyka związanego z piciem alkoholu. Wynik powyżej 8 punktów wymaga konsultacji.';
            break;
        case 'adhd':
            if (score >= 36) resultText = "Wysokie prawdopodobieństwo ADHD";
            else if (score >= 24) resultText = "Średnie prawdopodobieństwo ADHD";
            else resultText = "Niskie prawdopodobieństwo ADHD";
            description = 'Wynik jest jedynie wskaźnikiem i nie zastępuje diagnozy specjalisty. W przypadku wysokiego wyniku zalecana jest konsultacja z lekarzem.';
            break;
        case 'mmse':
            if (score >= 27) resultText = "Brak zaburzeń poznawczych";
            else if (score >= 24) resultText = "Łagodne zaburzenia poznawcze";
            else if (score >= 18) resultText = "Umiarkowane zaburzenia poznawcze";
            else resultText = "Ciężkie zaburzenia poznawcze";
            description = 'MMSE jest testem przesiewowym. Wynik poniżej 24 punktów może wskazywać na otępienie i wymaga dalszej diagnostyki.';
            break;
        default:
            resultText = interpretation || `Twój wynik: ${score} pkt`;
            description = 'Dziękujemy za wypełnienie testu. Pamiętaj, że wyniki testów internetowych mają charakter informacyjny i nie zastępują konsultacji ze specjalistą.';
    }
    
    testContent.innerHTML = `
        <div class="test-result">
            <h3>Wynik testu</h3>
            <div class="result-score">${score} pkt</div>
            <div class="result-description">
                <p><strong>Interpretacja:</strong> ${resultText}</p>
                <p>${description}</p>
            </div>
            <div class="result-actions">
                <button class="btn-outline" id="saveResult">Zapisz wynik</button>
                <button class="btn" id="closeTest">Zamknij</button>
            </div>
        </div>
    `;
    
    const saveResultBtn = document.getElementById('saveResult');
    if (saveResultBtn) {
        saveResultBtn.addEventListener('click', function() {
            saveTestResult(testId, score, resultText);
        });
    }
    
    const closeTestBtn = document.getElementById('closeTest');
    if (closeTestBtn) {
        closeTestBtn.addEventListener('click', function() {
            closeModal(document.getElementById('testModal'));
        });
    }
}

function saveTestResult(testId, score, resultText) {
    const user = getCurrentUser();
    
    if (!user) {
        alert('Aby zapisać wyniki, musisz być zalogowany.');
        openModal(document.getElementById('loginModal'));
        return;
    }
    
    let testHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
    
    if (!testHistory[user.email]) {
        testHistory[user.email] = [];
    }
    
    const testResult = {
        testId,
        testName: getTestName(testId),
        score,
        resultText,
        date: new Date().toISOString()
    };
    
    testHistory[user.email].push(testResult);
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    alert('Wynik został zapisany w Twojej historii.');
}

function getTestName(testId) {
    const testNames = {
        'phq9': 'Test depresji (PHQ-9)',
        'gad7': 'Test lęku (GAD-7)',
        'pss10': 'Test stresu (PSS-10)',
        'audit': 'Test uzależnienia od alkoholu (AUDIT)',
        'bigfive': 'Test osobowości (Big Five)',
        'adhd': 'Test ADHD u dorosłych',
        'mmse': 'Mini-Mental State Examination (MMSE)'
    };
    
    return testNames[testId] || 'Test psychologiczny';
}

function checkPremiumAccess(callback) {
    const user = getCurrentUser();
    
    if (!user) {
        alert('Aby uzyskać dostęp do testów Premium, musisz być zalogowany.');
        openModal(document.getElementById('loginModal'));
        return;
    }
    
    if (!user.isPremium) {
        if (confirm('Ten test jest dostępny tylko dla użytkowników Premium. Czy chcesz przejść do zakupu?')) {
            openModal(document.getElementById('paymentModal'));
            setupPaymentModal();
        }
    } else {
        callback();
    }
}

function setupPaymentModal() {
    const paymentContent = document.getElementById('paymentContent');
    if (!paymentContent) return;
    
    paymentContent.innerHTML = `
        <p>Wybierz metodę płatności:</p>
        <div class="payment-methods">
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="card" checked>
                Karta kredytowa
            </label>
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="paypal">
                PayPal
            </label>
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="transfer">
                Przelew bankowy
            </label>
        </div>
        <button id="simulatePayment" class="btn">Symuluj płatność</button>
        <p class="payment-note">Uwaga: To jest demonstracja frontendowa. Żadna prawdziwa płatność nie zostanie wykonana.</p>
    `;
    
    const simulatePaymentBtn = document.getElementById('simulatePayment');
    if (simulatePaymentBtn) {
        simulatePaymentBtn.addEventListener('click', function() {
            simulatePayment();
        });
    }
}

function simulatePayment() {
    showLoading();
    
    setTimeout(() => {
        const user = getCurrentUser();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const updatedUsers = users.map(u => {
            if (u.email === user.email) {
                return {
                    ...u,
                    isPremium: true,
                    premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                };
            }
            return u;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        const updatedUser = updatedUsers.find(u => u.email === user.email);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        hideLoading();
        closeModal(document.getElementById('paymentModal'));
        checkAuthStatus();
        
        alert('Dziękujemy za zakup konta Premium! Teraz masz dostęp do wszystkich testów i funkcji.');
    }, 2000);
}

function showBigFiveResult(results) {
    const testContent = document.getElementById('testContent');
    if (!testContent) return;
    
    testContent.innerHTML = `
        <div class="test-result">
            <h3>Twój profil osobowości</h3>
            <div class="big-five-results">
                <div class="big-five-trait">
                    <h4>Ekstrawersja</h4>
                    <div class="trait-score">${results.extraversion}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.extraversion * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Ugodowość</h4>
                    <div class="trait-score">${results.agreeableness}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.agreeableness * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Sumienność</h4>
                    <div class="trait-score">${results.conscientiousness}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.conscientiousness * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Neurotyczność</h4>
                    <div class="trait-score">${results.neuroticism}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.neuroticism * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Otwartość</h4>
                    <div class="trait-score">${results.openness}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.openness * 2}%"></div>
                    </div>
                </div>
            </div>
            <div class="result-description">
                <p>Model Wielkiej Piątki (Big Five) to jedna z najbardziej uznanych teorii osobowości w psychologii. Składa się z pięciu podstawowych wymiarów osobowości, które opisują różnice indywidualne między ludźmi.</p>
            </div>
            <div class="result-actions">
                <button class="btn-outline" id="saveResult">Zapisz wynik</button>
                <button class="btn" id="closeTest">Zamknij</button>
            </div>
        </div>
    `;
    
    const saveResultBtn = document.getElementById('saveResult');
    if (saveResultBtn) {
        saveResultBtn.addEventListener('click', function() {
            saveTestResult('bigfive', Object.values(results).reduce((a, b) => a + b, 0), 'Test osobowości Big Five');
        });
    }
    
    const closeTestBtn = document.getElementById('closeTest');
    if (closeTestBtn) {
        closeTestBtn.addEventListener('click', function() {
            closeModal(document.getElementById('testModal'));
        });
    }
}

function loadGenericTest(testId) {
    const testContent = document.getElementById('testContent');
    if (!testContent) return;
    
    const testName = getTestName(testId);
    
    testContent.innerHTML = `
        <h3>${testName}</h3>
        <p>Proszę odpowiedzieć na poniższe pytania zgodnie z instrukcjami.</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">Przykładowe pytanie testowe 1</p>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q1" value="0" required> Opcja 1
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="1"> Opcja 2
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="2"> Opcja 3
                    </label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">Przykładowe pytanie testowe 2</p>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q2" value="0" required> Opcja 1
                    </label>
                    <label class="option">
                        <input type="radio" name="q2" value="1"> Opcja 2
                    </label>
                    <label class="option">
                        <input type="radio" name="q2" value="2"> Opcja 3
                    </label>
                </div>
            </div>
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;
    
    const testForm = document.getElementById('testForm');
    if (testForm) {
        testForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const score = Math.floor(Math.random() * 100);
            showTestResult(testId, score);
        });
    }
}

// Funkcje pomocnicze
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'flex';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function checkAuthStatus() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');
    const premiumIndicator = document.getElementById('premiumIndicator');
    
    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userProfile) {
            userProfile.style.display = 'flex';
            document.getElementById('userName').textContent = user.name;
        }
        if (premiumIndicator) {
            premiumIndicator.style.display = user.isPremium ? 'inline-flex' : 'none';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'none';
        if (premiumIndicator) premiumIndicator.style.display = 'none';
    }
}
