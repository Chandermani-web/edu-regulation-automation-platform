import glob


txt_files = glob.glob("*.txt")

with open("result.txt", "w", encoding="utf-8") as outfile:
    for fname in txt_files:
        with open(fname, "r", encoding="utf-8") as infile:
            outfile.write(infile.read())
            outfile.write(" ")  
print("All TXT files combined into result.txt")