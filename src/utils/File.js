export default function ReadTextFromFile(file) {
    return new Promise((resolve, _) => {
        var reader = new FileReader();
        reader.onload = function(){
            resolve(reader.result);
        };
        reader.readAsText(file);
    });
}
