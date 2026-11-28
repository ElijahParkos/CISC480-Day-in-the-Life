// ending summary that records each choice the player makes
// and shows a summary screen when their path ends.
//
// load this file before game.js in index.html since it must read the 
// current scenario and choice text before game.js swaps in the next one


const choiceHistory = [];

// track choices from user by adding to choiceHistory
function recordChoice(question, choice, score, best, consequence) {
    choiceHistory.push({ question: question, choice: choice, score: score, best: best, consequence: consequence || '' });
}

// path is over when the chosen option doesn't point to another scenario
// need next fields in scenarios.json
function isEndOfPath(option) {
    return !option.next;
}

// display choices the player made
// also can put scoring feedback and results info here
function showEndingSummary(rankText) {
    const endingText = scenarios.Ending;

    // hide the scenario text and the choice buttons
    document.querySelector('.text-container').style.display = 'none';
    document.querySelector('.choice-container').style.display = 'none';

    document.body.classList.add('ending');

    // make matching
    const endingScreen = document.querySelector('#ending-screen');
    // endingScreen.id = 'ending-screen';
    endingScreen.style.display = 'block';
    endingScreen.className = 'text-container';
    endingScreen.style.overflowY = 'auto'; 

    const content = document.createElement('div');
    content.className = 'textbox';

    const section_heading = document.createElement('h2');
    section_heading.style.textAlign = 'center';
    if (getDayType() == 'Sunday') {
        section_heading.textContent  = 'How was your Sunday?'
    } else {
        section_heading.textContent  = `How was your ${getDayType()} Day?`
    }
    
    content.appendChild(section_heading);


    if (rankText) {
        const rank = document.createElement('h3');
        rank.style.textAlign = 'center';
        rank.textContent = rankText;
        if (getPercent() >= 50) {
            rank.style.color = 'var(--palette-green)';
        } else {
            rank.style.color = 'var(--palette-black)';
        }
        content.appendChild(rank);
    }
    
    // explanation of how the scoring works
    const explanation = endingText.Score_Explanation;

    // the button the player clicks
    const score_toggle = document.createElement('button');
    score_toggle.type = 'button';
    score_toggle.className = 'score-toggle';
    score_toggle.textContent = endingText.Score_Title;

    // the score explanation box
    const score_text = document.createElement('p');
    score_text.textContent = endingText.Score_Explanation;
    score_text.hidden = true;

    // show the explanation if it is hidden, hide it if it is showing
    function toggleExplanation() {
        if (score_text.hidden) {
            score_text.hidden = false;
        } else {
            score_text.hidden = true;
        }
    }

    score_toggle.addEventListener('click', toggleExplanation);

    content.appendChild(score_toggle);
    content.appendChild(score_text);

    
    const details = document.createElement('div');
    details.className = 'ending-panel';

    const list_header = document.createElement('h3');
    list_header.textContent = "Let's take a closer look:";
    details.appendChild(list_header);


    const accordion = document.createElement('div');
    accordion.className = 'accordion';

    function setOpen(item, open) {
        item.classList.toggle('is-open', open);
        item.querySelector('.accordion-content-description').hidden = !open;
        
        if (open) {
            item.querySelector('.accordion-icon').textContent = '−';
        }  else {
            item.querySelector('.accordion-icon').textContent = '+';
        }
    }

    choiceHistory.forEach(function (entry, index) {
        const item = document.createElement('div');
        item.className = 'accordion-content';

        const heading = document.createElement('p');
        heading.className = 'accordion-heading';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'accordion-trigger';

        const title = document.createElement('span');
        title.className = 'accordion-content-title';
        title.textContent = `${index + 1}. ${entry.question}`;

        const icon = document.createElement('span');
        icon.className = 'accordion-icon';
        icon.textContent = '+';

        trigger.appendChild(title);
        trigger.appendChild(icon);
        heading.appendChild(trigger);

        const panel = document.createElement('div');
        panel.className = 'accordion-content-description';
        panel.hidden = true;

        const choice = document.createElement('p');
        choice.textContent = `You chose: ${entry.choice}`;
        panel.appendChild(choice);

        const consequence = document.createElement('p');
        consequence.textContent = `Remember: ${entry.consequence}`;
        panel.appendChild(consequence);

        if (entry.score !== undefined) {
            const score = document.createElement('p');
            score.textContent = `Score: ${entry.score}/${entry.best}`;
            panel.appendChild(score);
        }

        trigger.addEventListener('click', function () {
            const willOpen = !item.classList.contains('is-open');

            // one open at a time: delete this loop to allow several
            accordion.querySelectorAll('.accordion-content').forEach(function (other) {
                setOpen(other, false);
            });

            setOpen(item, willOpen);
        });

        item.appendChild(heading);
        item.appendChild(panel);
        accordion.appendChild(item);
    });
    content.appendChild(accordion);

    const comment_container = document.createElement('div');
    comment_container.className = 'ending-panel';
    comment_container.style.display = 'flex';
    comment_container.style.flexDirection = 'column';
    comment_container.style.alignItems = 'center';
    const comment = document.createElement(`h2`);
    comment.textContent = getComment();
    comment.style.textAlign = 'center';
    comment_container.appendChild(comment);

    // encouraging line from scenarios.json
    const encouragement = document.createElement('p');
    encouragement.textContent = endingText.Encouragement;
    encouragement.style.textAlign = 'center';
    encouragement.style.color = 'var(--palette-purple)';
    comment_container.appendChild(encouragement);

    const playAgain = document.createElement('button');
    playAgain.className = 'choice-btn';
    
    playAgain.style.height = 'auto';
    playAgain.style.padding = '1em';
    playAgain.style.width = '150px';
    playAgain.style.textAlign = 'center';
    playAgain.textContent = 'Play again';
    playAgain.style.minHeight = '0px';
    playAgain.addEventListener('click', function () {
        location.reload();
    });
    comment_container.appendChild(playAgain);
    endingScreen.appendChild(content);
    document.querySelector('.banner').appendChild(endingScreen);
    
    const main = document.querySelector('main');
    main.appendChild(details);
    main.appendChild(comment_container);
}
