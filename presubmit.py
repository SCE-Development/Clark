import os
from subprocess import check_output, PIPE

def run_test(test_name, command):
    termCommand = command + ' ' + test_name
    testName = test_name
    numDots = 37 - len(testName)
    dots = ""
    i = 0
    while i < numDots:
        dots+="."
        i = i + 1
    
    dotsPassed = dots + "passed"
    dotsFailed = dots + "failed"
    try:
        check_output(termCommand, shell=True, stderr=PIPE)
        print(test_name + dotsPassed)
    except:
        print(test_name + dotsFailed)
    
print("\nRunning tests....\n")
run_test('api-test', 'npm run')
run_test('frontend-test', 'npm run')
run_test('lint', 'npm run')
run_test('build', 'npm run')

