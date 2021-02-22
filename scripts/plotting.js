function getData() {
    return Math.random();
}

Plotly.plot('chart',[{
    y:[getData()],
    type:'line'
}]);