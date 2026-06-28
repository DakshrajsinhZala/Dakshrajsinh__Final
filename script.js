const password = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const entropy = document.getElementById("entropy");
const crackTime = document.getElementById("crackTime");
const feedback = document.getElementById("feedback");
const score = document.getElementById("score");

password.addEventListener("input", checkPassword);

function checkPassword(){

let pass = password.value;

if(pass.length===0){
strengthBar.style.width="0%";
strengthText.innerText="Strength: -";
return;
}

const result = zxcvbn(pass);

score.innerText = result.score;

entropy.innerText =
Math.round(result.guesses_log10 * 3.32);

crackTime.innerText =
result.crack_times_display
.offline_fast_hashing_1e10_per_second;

feedback.innerHTML = "";

if(result.feedback.warning){
feedback.innerHTML +=
`<p>⚠ ${result.feedback.warning}</p>`;
}

result.feedback.suggestions.forEach(s=>{
feedback.innerHTML += `<p>✅ ${s}</p>`;
});

const colors = [
"#ff0000",
"#ff6600",
"#ffcc00",
"#66cc00",
"#00cc66"
];

const names = [
"Very Weak",
"Weak",
"Medium",
"Strong",
"Very Strong"
];

strengthBar.style.width =
((result.score+1)*20)+"%";

strengthBar.style.background =
colors[result.score];

strengthText.innerText =
"Strength: " +
names[result.score];
}

document.getElementById("showBtn")
.addEventListener("click",()=>{

password.type =
password.type==="password"
?
"text"
:
"password";

});

document.getElementById("themeBtn")
.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

const length =
document.getElementById("length");

const lengthValue =
document.getElementById("lengthValue");

length.oninput=()=>{
lengthValue.innerText=length.value;
};

document.getElementById("generateBtn")
.addEventListener("click",generatePassword);

function generatePassword(){

const upper =
"ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const lower =
"abcdefghijklmnopqrstuvwxyz";

const numbers =
"0123456789";

const symbols =
"!@#$%^&*()_+-={}[]<>?";

let chars="";

if(document.getElementById("upper").checked)
chars+=upper;

if(document.getElementById("lower").checked)
chars+=lower;

if(document.getElementById("number").checked)
chars+=numbers;

if(document.getElementById("symbol").checked)
chars+=symbols;

if(chars===""){
alert("Select at least one option.");
return;
}

let pass="";

for(let i=0;i<length.value;i++){

pass+=chars[
Math.floor(
Math.random()*chars.length
)
];

}

password.value=pass;

checkPassword();
}

document.getElementById("copyBtn")
.addEventListener("click",()=>{

navigator.clipboard
.writeText(password.value);

alert("Password Copied!");
});
