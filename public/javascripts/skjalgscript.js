function newcity() {
  var newcity = document.getElementById("cityput").value;
  window.location.href = `/?city=${newcity}`;
}

document.getElementById("cityput").addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    newcity();
  }
});
document.getElementById("citybtn").addEventListener('click', newcity);

function override(mood) {
  var newcity = document.getElementById("cityput").value;
  window.location.href = `/?city=${newcity}&override=${mood}`;
}


function gotovideo(link){
  window.open(link, '_blank').focus();
}