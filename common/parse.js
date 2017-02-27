exports.parseInputOrder = function(string) {
        var data = string.toLowerCase().split(' ');

        if(data.length > 5)
        {
            console.log('Command has too many words! Returning with 5 results only...');
            return {
                first: data[0],
                second: data[1],
                third: data[2],
                fourth: data[3],
                fifth: data[4]
            };
        }
        return  {
            first: data[0],
            second: data[1],
            third: data[2],
            fourth: data[3],
            fifth: data[4]
        }
}