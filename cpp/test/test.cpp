int main(int argc, char **argv){
    
    long long prev = 0;
    long long num = 0;
    for (int i = 0; i < 999999; i++){
        long long t = num;
        num = prev+num;
        prev = num;
    }
    
    return num;
}