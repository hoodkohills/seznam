exports.parseInputOrder = function(string) {
        var data = string.toLowerCase().split(' ');

        if(data.length > 5)
        {
            context.succeed('Command has too many words! Returning with no results...');
            return {first: '', second: '', third: '', fourth: '', fifth: '' };
        }
        return  {
            first: data[0],
            second: data[1],
            third: data[2],
            fourth: data[3],
            fifth: data[4]
        }
}