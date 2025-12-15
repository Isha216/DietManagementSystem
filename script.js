
let meals = [];
let totalCalories = 0;
let dailyGoal = 2000;

//loading meals from database on page load
async function loadMeals(){
    try {
        const response = await fetch('http://localhost:5000/api/meals');
        meals = await response.json();
        totalCalories = meals.reduce((sum, meal) => sum + meal.calories,
    0);
    renderMeals();
    updateTotals();
    } catch (err) {
        console.log('Use local mode:', err);

    }
}


//BMI calculator
document.getElementById('calculateBMI').addEventListener('click', 
    function()
    {
         const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value) / 100;
        

        const bmi = weight / (height * height);

        const resultDiv = document.getElementById('bmiResult');
        if (isNaN(bmi)) {
            resultDiv.innerHTML = "Please enter valid values";
            return;
        }

        let category = '';
        if (bmi < 18.5) category = 'UnderWeight';
        else if (bmi < 25) category = 'Normal';
        else if (bmi < 30) category = 'OverWeight';
        else category = 'Obese';

        resultDiv.innerHTML = `BMI: ${bmi.toFixed(1)} (${category})`;

    });

//Adding Meal with Ajax POST

document.getElementById('addMeal').addEventListener('click',
    async function()
    {
        const foodName = document.getElementById('foodName').value.trim();
        const calories = parseFloat(document.getElementById('calories').value );

        if (!foodName || isNaN(calories) ||calories <= 0){
            alert("Please enter valid food name and calories");
            return;
        }

        try{
            //sending to databsse
            const response = await fetch('http://localhost:5000/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ food_name: foodName, calories }
                )
            });
        
        const newMeal = await response.json();
        meals.unshift(newMeal);
        totalCalories += calories;


        document.getElementById('foodName').value = '';
        document.getElementById('calories').value = '';

        renderMeals();
        updateTotals();
        } catch (err){
            alert('Server error - check backend');
        }
    }
);

// delete function for delete button

async function deleteMeal(id) {

    console.log('Deleting meal ID:', id);
    try{
    await fetch(`http://localhost:5000/api/meals/${id}`, { method: 'DELETE' });
    meals = meals.filter(meal => meal.id !== id);
    loadMeals(); //reload totals from db
    } catch (err) {
        console.log('Delete error:', err);
    }
}

// impovisation with event Deligation can be done

// renderMeal Function

function renderMeals() {
    const mealsList = document.getElementById('mealsList');
    if(meals.length === 0) {
        mealsList.innerHTML = '<p>No meals added yet</p>';
        return;
    }

    mealsList.innerHTML = meals.map(meal => `
        <div class="meal-item">
        <span class="meal-name">${meal.food_name || meal.name}</span>
        <span class="meal-calories">${meal.calories} kcal</span>
        <button class="delete-btn" onclick="deleteMeal(${meal.id})">Delete</button>
        </div>
        `).join('');
}


// updateTotal Function

function updateTotals() {
    document.getElementById('totalValue').textContent = totalCalories;

    dailyGoal = parseInt(document.getElementById('dailyGoal').value) || 2000;
    const percentage = Math.min((totalCalories / dailyGoal) * 100, 100);
    document.getElementById('progressFill').style.width = percentage + "%";
    document.getElementById('progressText').textContent = percentage.toFixed(0) + "% (" + totalCalories + "/" + dailyGoal + ")";

}


document.getElementById('dailyGoal').addEventListener("input",updateTotals);

window.deleteMeal = deleteMeal; 
loadMeals();
