 const reactionStartBtn = document.getElementById('reactionStartBtn');
    const reactionPrompt = document.getElementById('reactionPrompt');
    const reactionClickBtn = document.getElementById('reactionClickBtn');
    const reactionResult = document.getElementById('reactionResult');
    const mathAnswer = document.getElementById('mathAnswer');
    const mathSubmit = document.getElementById('mathSubmit');
    const mathResult = document.getElementById('mathResult');
    const imagePrompt = document.getElementById('imagePrompt');
    const imageGrid = document.getElementById('imageGrid');
    const imageSubmit = document.getElementById('imageSubmit');
    const imageResult = document.getElementById('imageResult');
    const balanceSelect = document.getElementById('balanceSelect');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultPanel = document.getElementById('resultPanel');
    const scoreText = document.getElementById('scoreText');
    const adviceText = document.getElementById('adviceText');
    const index = document.getElementById('mathProblem');

    let reactionStartTime = null;
    let reactionScore = null;
    let mathScore = null;
    let imageScore = null;
    let currentAnswer1 = null;
    let currentAnswer2 = null;
    let currentImageChallenge = null;
    let mathAnswered = false;
    let imageSolved = false;
    let mathlength = 0;

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


    function generateMathProblem() {
      currentAnswer1 = Math.floor(Math.random() * 21) + 20;
      currentAnswer2 = Math.floor(Math.random() * 21) + 20;
      mathlength = currentAnswer1.toString().length + currentAnswer2.toString().length + 3; // " + " has 3 characters
      index.textContent = `What is ${currentAnswer1} + ${currentAnswer2}?`;
      mathAnswered = false;
      mathAnswer.disabled = false;
      mathAnswer.value = '';
      mathResult.textContent = '';
    }

    function generateImageChallenge() {
      const challenges = [
        {
          prompt: 'Select all images that contain a bicycle seat.',
          items: [
            { src: 'images/Dog1.png', alt: 'Star', contains: true },
            { src: 'images/apple.png', alt: 'Apple', contains: false },
            { src: 'images/star.png', alt: 'Star', contains: true },
            { src: 'images/dog.png', alt: 'Dog', contains: false },
            { src: 'images/star.png', alt: 'Star', contains: true },
            { src: 'images/cloud.png', alt: 'Cloud', contains: false }
          ]
        },
        {
          prompt: 'Select all images that contain a moon.',
          items: [
            { src: 'images/moon.png', alt: 'Moon', contains: true },
            { src: 'images/sun.png', alt: 'Sun', contains: false },
            { src: 'images/moon.png', alt: 'Moon', contains: true },
            { src: 'images/star.png', alt: 'Star', contains: false },
            { src: 'images/moon.png', alt: 'Moon', contains: true },
            { src: 'images/fire.png', alt: 'Fire', contains: false }
          ]
        },
        {
          prompt: 'Select all images that contain a heart.',
          items: [
            { src: 'images/heart.png', alt: 'Heart', contains: true },
            { src: 'images/water.png', alt: 'Water', contains: false },
            { src: 'images/heart.png', alt: 'Heart', contains: true },
            { src: 'images/cactus.png', alt: 'Cactus', contains: false },
            { src: 'images/heart.png', alt: 'Heart', contains: true },
            { src: 'images/leaf.png', alt: 'Leaf', contains: false }
          ]
        }
      ];

      currentImageChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      imagePrompt.textContent = currentImageChallenge.prompt;
      imageGrid.innerHTML = currentImageChallenge.items
        .map((item, index) => `
          <button type="button" class="image-choice" data-index="${index}" data-contains="${item.contains}">
            <img src="${item.src}" alt="${item.alt}" />
            <span>${item.alt}</span>
          </button>
        `)
        .join('');
      imageSolved = false;
      imageScore = null;
      imageResult.textContent = '';
      imageSubmit.disabled = false;
    }

    generateMathProblem();
    generateImageChallenge();

    mathSubmit.addEventListener('click', () => {
      if (mathAnswered) {
        return;
      }

      const userValue = Number(mathAnswer.value);
      mathResult.textContent = '';

      if (mathAnswer.value.trim() === '') {
        mathResult.textContent = 'Please enter a number.';
        return;
      }

      if (userValue === currentAnswer1 + currentAnswer2) {
        mathResult.textContent = 'Correct';
        mathScore = 0;
      } else {
        mathResult.textContent = 'Incorrect';
        mathScore = 2;
      }

      mathAnswered = true;
      mathAnswer.disabled = true;
      mathSubmit.disabled = true;
    });

    imageGrid.addEventListener('click', (event) => {
      if (imageSolved) {
        return;
      }

      const button = event.target.closest('button');
      if (!button || !imageGrid.contains(button)) {
        return;
      }

      button.classList.toggle('selected');
      const selected = button.classList.contains('selected');
      button.style.borderColor = selected ? '#007bff' : '#999';
      button.style.background = selected ? '#e6f0ff' : '#fff';
    });

    imageSubmit.addEventListener('click', () => {
      if (imageSolved) {
        return;
      }

      const choices = Array.from(imageGrid.querySelectorAll('button'));
      const selectedIndexes = choices
        .filter(btn => btn.classList.contains('selected'))
        .map(btn => Number(btn.dataset.index));

      const correctIndexes = currentImageChallenge.items
        .map((item, index) => item.contains ? index : -1)
        .filter(index => index !== -1);

      const isCorrect = selectedIndexes.length === correctIndexes.length &&
        selectedIndexes.every(index => correctIndexes.includes(index));

      if (isCorrect) {
        imageResult.textContent = 'Correct';
        imageScore = 0;
      } else {
        imageResult.textContent = 'Incorrect';
        imageScore = 2;
      }

      imageSolved = true;
      imageSubmit.disabled = true;
      choices.forEach(btn => btn.disabled = true);
    });

    calculateBtn.addEventListener('click', () => {
      const balanceValue = Number(balanceSelect.value);
      const drinkScore = balanceValue;
      const reactionComponent = reactionScore !== null ? reactionScore : 2;
      const mathComponent = mathScore !== null ? mathScore : 2;
      const imageComponent = imageScore !== null ? imageScore : 2;
      const totalScore = clamp(Math.round(reactionComponent + mathComponent + drinkScore + imageComponent), 0, 9);

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
      if (imageScore === null) {
        advice += ' (Image challenge was not completed.)';
      }

      adviceText.textContent = advice;
      resultPanel.style.display = 'block';
    });