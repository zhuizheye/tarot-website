document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const deck = document.getElementById('deck');
  const drawButton = document.getElementById('draw-button');
  const drawnCardContainer = document.getElementById('drawn-card-container');
  const interpretationArea = document.getElementById('interpretation-area');
  const cardName = document.getElementById('card-name');
  const cardOrientation = document.getElementById('card-orientation');
  const viewMoreLink = document.getElementById('view-more-link');
  
  // Content elements for tab sections
  const storyContent = document.getElementById('story-content');
  const symbolismContent = document.getElementById('symbolism-content');
  const loveContent = document.getElementById('love-content');
  const careerContent = document.getElementById('career-content');
  const studyContent = document.getElementById('study-content');
  const overallContent = document.getElementById('overall-content');
  
  // Tab navigation
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-pane');
  
  // Card drawing state
  let isDrawing = false;
  let currentCard = null;
  
  // Initialize GSAP timeline
  const tl = gsap.timeline({ paused: true });
  
  // Tab switching functionality
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));
      
      // Add active class to current tab
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Draw card functionality
  drawButton.addEventListener('click', drawCard);
  deck.addEventListener('click', drawCard);
  
  function drawCard() {
    if (isDrawing) return;
    isDrawing = true;
    
    // Reset view
    drawnCardContainer.innerHTML = '';
    drawnCardContainer.classList.add('hidden');
    interpretationArea.classList.add('hidden');
    
    // Start animation
    animateCardDrawing();
    
    // Call the API to get a random card
    fetch('/api/draw_card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Save the current card data
        currentCard = data;
        
        // Update the "View More" link
        if (viewMoreLink) {
          // 创建卡牌的URL友好名称
          const cardSlug = createSlug(data.card.english_name);
          viewMoreLink.href = `/cards/${cardSlug}`;
        }
        
        // After animation completes, display the card
        setTimeout(() => {
          displayDrawnCard(data);
        }, 2000); // Match this with animation duration
      })
      .catch(error => {
        console.error('Error drawing card:', error);
        
        // If API fails, use a mock response for development/testing
        const mockCard = getMockCardResponse();
        
        setTimeout(() => {
          displayDrawnCard(mockCard);
        }, 2000);
        
        console.log("Using mock card data for development:", mockCard);
      });
  }
  
  // Mock Card Response for Development/Testing
  function getMockCardResponse() {
    // Selection of common cards
    const sampleCards = [
      {
        card: {
          name: "愚者",
          english_name: "The Fool",
          image_filename: "00_The_Fool.jpg",
          is_reversed: Math.random() > 0.7
        },
        interpretation: {
          story_background: "愚者是塔罗牌中编号为0的牌，代表着旅程的开始。画面中展示了一位年轻人站在悬崖边缘，无忧无虑地朝前迈步，手持白玫瑰（纯洁的象征），身旁有一只小白狗。他携带少量行囊，头上仰望天空，仿佛对前方的冒险充满期待。",
          symbolism: "愚者象征着纯真、自发性、勇气、冒险和新的开始。悬崖代表未知的挑战，小狗象征着忠诚和直觉，白玫瑰象征纯洁的信念。愚者的姿态表明他对未知世界的探索精神。",
          love: "在感情方面，愚者表示新的浪漫可能性、无条件的爱和对感情的乐观态度。可能是一段全新关系的开始，或是对现有关系注入新的活力。建议保持开放心态，愿意接受爱情中的冒险和惊喜。",
          career: "在职业方面，愚者预示着新的工作机会、职业转换或开创性的项目。暗示这是追求你真正热爱的职业道路的好时机。鼓励你跳出舒适区，尝试新的方向，相信自己的直觉和能力。",
          study: "在学业上，愚者代表学习新知识、尝试新学科的良好时机。表明你可能对某个领域产生强烈兴趣，并愿意投入精力学习。建议保持好奇心和探索精神，不要因为担心失败而止步不前。",
          overall: "总体而言，愚者是一张充满希望和可能性的牌。它鼓励你敞开心扉，勇敢面对新的挑战，相信自己的直觉。现在是踏上新旅程的理想时机，即使前方有风险，但通过保持乐观和灵活的态度，你将获得宝贵的经验和成长。无论面对什么情况，保持那份初生牛犊不怕虎的勇气吧！"
        }
      },
      {
        card: {
          name: "星星",
          english_name: "The Star",
          image_filename: "17_The_Star.jpg",
          is_reversed: Math.random() > 0.7
        },
        interpretation: {
          story_background: "星星牌呈现了一位裸体女子单膝跪在水边，一手将水倒入池中，另一手将水洒在陆地上。她头顶上方有一颗明亮的大星，周围环绕着七颗较小的星星。这个场景代表着净化、希望和精神更新。",
          symbolism: "星星代表着希望、灵感、宁静和精神指引。水象征情感和潜意识，大地象征物质世界，而星星则代表更高的灵性指引。女子倾倒的水象征着生命的流动和情感的净化。",
          love: "在爱情方面，星星暗示着情感的疗愈和关系中的希望。这是重建信任、找到情感平衡的好时机。如果你正在寻找爱情，星星预示着美好姻缘可能即将出现。保持开放和乐观的心态。",
          career: "在职业上，星星意味着创意灵感、新的职业方向和发展潜力。现在是追随你真正热情的时候，可能会有新的机会出现在看似不可能的地方。相信自己的才能，保持希望。",
          study: "在学业上，星星带来学习的灵感和创造力。这是拓展知识、发现新领域兴趣的好时机。你可能会在研究中找到突破点，或接收到有益的指导。保持专注但不要给自己太大压力。",
          overall: "总体而言，星星是一张带来希望和启示的牌。它告诉你困难时期已经过去，现在是疗愈和重建的时刻。无论你目前面临什么挑战，都有理由保持乐观。相信宇宙的引导，接受内心的平静，你会发现自己走在正确的道路上。"
        }
      },
      {
        card: {
          name: "皇后",
          english_name: "The Empress",
          image_filename: "03_The_Empress.jpg",
          is_reversed: Math.random() > 0.7
        },
        interpretation: {
          story_background: "皇后牌描绘了一位丰满美丽的女性，身穿星星图案的长袍，头戴十二颗星星的王冠，手持权杖，坐在舒适的靠垫上。周围是茂盛的森林和瀑布，代表着生命的繁盛和自然的丰饶。",
          symbolism: "皇后象征着母性能量、丰饶、创造力和自然界的养育力量。她代表着爱、美、和谐以及物质与精神上的丰盛。心形盾牌象征爱和保护，而金色象征物质的富足。",
          love: "在感情上，皇后表示关系将会变得更丰富和满足。这是表达爱意、加深情感纽带的好时机。单身者可能会遇到充满爱心和关怀的伴侣，现有的关系则会体验到更深层次的亲密和满足。",
          career: "在职业方面，皇后预示着创意项目的成功、工作环境的和谐以及物质回报的增加。现在是展示你创造力和领导力的时候，尤其适合与艺术、设计、抚育或自然相关的职业。",
          study: "在学习上，皇后鼓励你运用创造性思维和直觉。这是拓展知识、享受学习过程的好时机。可能会有导师或支持者出现，给予你宝贵的指导和鼓励。",
          overall: "总体而言，皇后是一张带来丰盛和创造力的牌。她提醒你要珍视生活中的美好事物，关注养育自己和他人的能力。现在是表达爱、发挥创造力并与自然和谐相处的时刻。相信自己的直觉和创造力，你将会收获丰盛的成果。"
        }
      }
    ];
    
    // Return a random card from the sample
    return sampleCards[Math.floor(Math.random() * sampleCards.length)];
  }
  
  // 创建URL友好的slug
  function createSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }
  
  function animateCardDrawing() {
    // Reset timeline
    tl.clear();
    
    // Add deck shuffle animation
    tl.to('.deck', {
      x: 20,
      y: -10,
      rotation: 5,
      duration: 0.2,
      ease: 'power1.inOut'
    })
    .to('.deck', {
      x: -20,
      y: 5,
      rotation: -3,
      duration: 0.2,
      ease: 'power1.inOut'
    })
    .to('.deck', {
      x: 10,
      y: -5,
      rotation: 2,
      duration: 0.2,
      ease: 'power1.inOut'
    })
    .to('.deck', {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.2,
      ease: 'power1.inOut'
    })
    .to('.deck', {
      y: '-=30',
      duration: 0.3,
      ease: 'power1.out'
    })
    .to('.deck', {
      y: '+=30',
      duration: 0.3,
      ease: 'bounce.out'
    })
    .to('.mystical-elements .mystical-element', {
      opacity: 0.5,
      y: -20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    }, "-=0.5")
    .to('.mystical-elements .mystical-element', {
      opacity: 0,
      y: -40,
      duration: 0.3,
      ease: 'power2.in'
    });
    
    // Start the animation
    tl.play();
  }
  
  function displayDrawnCard(data) {
    const { card, interpretation } = data;
    
    // Create card element
    const cardElement = document.createElement('div');
    cardElement.className = `drawn-card ${card.is_reversed ? 'reversed' : ''}`;
    
    // Create image element for the card
    const imgElement = document.createElement('img');
    imgElement.src = `/images/tarot/optimized/${card.image_filename}`;
    imgElement.alt = card.english_name;
    imgElement.onerror = () => {
      // Fallback if optimized image is not found, try the original
      imgElement.src = `/images/tarot/${card.image_filename}`;
      imgElement.onerror = () => {
        // Fallback if both images are not found
        imgElement.src = 'https://via.placeholder.com/200x340?text=Card+Image+Not+Found';
      };
    };
    
    // Append the image to the card element
    cardElement.appendChild(imgElement);
    
    // Append the card to the container
    drawnCardContainer.appendChild(cardElement);
    drawnCardContainer.classList.remove('hidden');
    
    // Add floating animation to the drawn card
    cardElement.classList.add('floating');
    
    // Update interpretation area
    cardName.textContent = `${card.name} (${card.english_name})`;
    cardOrientation.textContent = card.is_reversed ? '逆位' : '正位';
    
    // Populate tab content
    const orientation = card.is_reversed ? 'reversed' : 'upright';
    storyContent.textContent = interpretation.story_background;
    symbolismContent.textContent = interpretation.symbolism;
    loveContent.textContent = interpretation.love;
    careerContent.textContent = interpretation.career;
    studyContent.textContent = interpretation.study;
    overallContent.textContent = interpretation.overall;
    
    // Show interpretation area with slight delay
    setTimeout(() => {
      interpretationArea.classList.remove('hidden');
      
      // Scroll to interpretation area
      interpretationArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Reset drawing state
      isDrawing = false;
    }, 500);
  }
}); 