 const reactionStartBtn = document.getElementById('reactionStartBtn');
    const reactionPrompt = document.getElementById('reactionPrompt');
    const reactionClickBtn = document.getElementById('reactionClickBtn');
    const reactionResult = document.getElementById('reactionResult');
    const mathAnswer = document.getElementById('mathAnswer');
    const mathResult = document.getElementById('mathResult');
    const balanceSelect = document.getElementById('balanceSelect');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultPanel = document.getElementById('resultPanel');
    const scoreText = document.getElementById('scoreText');
    const adviceText = document.getElementById('adviceText');

    let reactionStartTime = null;
    let reactionScore = null;
    let mathScore = null;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    reactionStartBtn.addEventListener('click', () => {
      reactionResult.textContent = 'Get ready...';
      reactionPrompt.style.display = 'none';
      reactionStartBtn.disabled = true;

      const delay = 1500 + Math.random() * 1500;
      setTimeout(() => {
        reactionStartTime = performance.now();
        reactionPrompt.style.display = 'block';
        reactionResult.textContent = 'Click the button as fast as you can!';
      }, delay);
    });

    reactionClickBtn.addEventListener('click', () => {
      const elapsed = performance.now() - reactionStartTime;
      reactionScore = clamp((elapsed - 250) / 250, 0, 3);
      reactionResult.textContent = `Reaction time: ${elapsed.toFixed(0)} ms`;
      reactionPrompt.style.display = 'none';
      reactionStartBtn.disabled = false;
    });

    mathAnswer.addEventListener('input', () => {
      const userValue = Number(mathAnswer.value);
      if (!userValue) {
        mathResult.textContent = '';
        mathScore = null;
        return;
      }
      if (userValue === 61) {
        mathResult.textContent = 'Correct';
        mathScore = 0;
      } else {
        mathResult.textContent = 'Incorrect';
        mathScore = 2;
      }
    });

    calculateBtn.addEventListener('click', () => {
      const balanceValue = Number(balanceSelect.value);
      const drinkScore = balanceValue;
      const reactionComponent = reactionScore !== null ? reactionScore : 2;
      const mathComponent = mathScore !== null ? mathScore : 2;
      const totalScore = clamp(Math.round(reactionComponent + mathComponent + drinkScore), 0, 9);

      scoreText.textContent = `Score: ${totalScore} / 9`;
      let advice = '';

      if (totalScore <= 2) {
        advice = 'You seem to be in good shape. Still, stay safe and avoid risky behavior.';
      } else if (totalScore <= 5) {
        advice = 'You may be mildly impaired. Take it easy, stay with friends, and avoid driving.';
      } else if (totalScore <= 7) {
        advice = 'Your responses suggest moderate impairment. Rest, hydrate, and do not operate vehicles or heavy machinery.';
      } else {
        advice = 'High impairment warning. Seek a safe place, do not drive, and consider getting help from a sober friend.';
      }

      if (reactionScore === null) {
        advice += ' (Reaction test was not completed.)';
      }
      if (mathScore === null) {
        advice += ' (Math test was not completed.)';
      }

      adviceText.textContent = advice;
      resultPanel.style.display = 'block';
    });