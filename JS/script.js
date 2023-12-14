// Funktion för att hämta data från RapidAPI API och visa det på en sida
const fetchData = async () => {
  // skapar en prompt med promise
  const userInputPromise = new Promise((resolve) => {
      const userInput = prompt('Vilken typ av mat vill du beställa?');
      resolve(userInput);
  });

  // Vänta på användarens input
  const userFoodInput = await userInputPromise;

  // Kontrollera om användaren angav något
  if (userFoodInput) {
      // hämtar receptdata från RapidAPI
      const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${encodeURIComponent(userFoodInput)}&fillIngredients=false&addRecipeInformation=false&sort=calories&limitLicense=false`;

      // länkar API key och host
      const options = {
          method: 'GET',
          headers: {
              'X-RapidAPI-Key': '219158fa15msh36446b0dc6425bbp15751ajsn87ef82df6743',
              'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
          }
      };

      try {
          // Gör HTTP-requesten och hämtar JSON resultat
          const response = await fetch(url, options);
          const result = await response.json();

          // Kollar om det finns resultat
          if (result.results && result.results.length > 0) {
              // Skapar en container för matinformation och centrerar innehållet
              const foodContainer = document.createElement('div');
              foodContainer.setAttribute('id', 'foodContainer');
              foodContainer.style.textAlign = 'center';

              // Lägger till matcontainern i body så man kan se det
              document.body.appendChild(foodContainer);

              // Funktion som tar bort mat containern
              const clearContent = () => {
                  while (foodContainer.firstChild) {
                      foodContainer.removeChild(foodContainer.firstChild);
                  }
              };

              // visar recept, titel och kaloriinformation
              result.results.forEach(recipe => {
                  const title = recipe.title;
                  const calories = recipe.nutrition.nutrients.find(nutrient => nutrient.name === 'Calories').amount;

                  const recipeInfo = document.createElement('p');
                  recipeInfo.textContent = `Recept: ${title}, Kalorier: ${calories} kcal`;

                  foodContainer.appendChild(recipeInfo);
              });

              // Skapar en knapp för användaren att klicka på
              const readyButton = document.createElement('button');
              readyButton.textContent = 'Jag är redo att beställa';
              readyButton.addEventListener('click', async () => {
                  // prompta användaren
                  const userRecipeInput = prompt('Vilken specifik rätt vill du ha?');

                  // Rensar mat containern
                  clearContent();

                  // Hittar det valda receptet
                  const selectedRecipe = result.results.find(recipe => recipe.title.toLowerCase() === userRecipeInput.toLowerCase());

                  // Visar bilden på webbplatsen
                  if (selectedRecipe) {
                      const recipeImage = selectedRecipe.image;

                      // Skapar en container för att centrera bilden
                      const imageContainer = document.createElement('div');
                      imageContainer.style.textAlign = 'center';

                      // Skapar img element
                      const recipeImageElement = document.createElement('img');
                      recipeImageElement.setAttribute('src', recipeImage);
                      recipeImageElement.setAttribute('alt', userRecipeInput);
                      recipeImageElement.setAttribute('width', '600');
                      recipeImageElement.classList.add('img-fluid'); // Lägger till Bootstrap-klassen för responsiva bilder

                      // Lägger till bilden i containern så man kan se den och så den kan centreras
                      imageContainer.appendChild(recipeImageElement);

                      // Lägger till bildcontainern i matcontainern
                      foodContainer.appendChild(imageContainer);

                      // Skapar en knapp för att börja om
                      const startOverButton = document.createElement('button');
                      startOverButton.textContent = 'Börja om';
                      startOverButton.style.marginTop = '10px'; // Lägg till marginal för mellanrum
                      startOverButton.style.padding = '10px'; // Öka padding för en större knapp
                      startOverButton.addEventListener('click', () => {
                          // Rensar innehållet i matcontainern när man trycker på knappen
                          clearContent();

                          fetchData();
                      });

                      // Lägger in börja om knappen i containern
                      foodContainer.appendChild(startOverButton);
                  } else {
                      alert(`Tyvärr har vi inte ${userRecipeInput} på menyn.`);
                  }
              });

              // Lägger till ready knappen i matcontainern
              foodContainer.appendChild(readyButton);

          } else {
              alert(`Inga recept hittades för ${userFoodInput}`);
          }
      } catch (error) {
          console.error('Fel:', error);
      }
  } else {
      console.log('Användaren angav inget.');
  }
};

fetchData();