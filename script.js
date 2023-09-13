

function newcity() {
    var newcity = document.getElementById("city").value;
    console.log(newcity);
    window.location.href = '/?city=' + newCity;
}

document.getElementById("cityput").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        newcity();
    }
});
document.getElementById("citybtn").addEventListener('click', newcity);