/* eslint-disable import/no-commonjs, one-var, no-console, max-nested-callbacks */
var R = require('ramda');
var exec = require('child_process').exec;
var parse = require('diff-parse');
var ignore = require('ignore');
var fs = require('fs');
var path = require('path');
var ignorelist = fs.readFileSync('./.coverageignore').toString();
var ignoreFilter = ignore().add(ignorelist).createFilter();
var isJs = R.test(/\.js[x]?$/);
var Table = require('cli-table');
var endOfLine = require('os').EOL;
var THRESHOLD = process.env.COVERAGE_THRESHOLD || 100;
var NEW_ONLY = process.env.COVERAGE_NEW_ONLY || false;
var filesForCover = R.reject(
    R.either(
        R.propSatisfies(
            R.anyPass([R.complement(isJs), R.complement(ignoreFilter)]),
            'path'
        ),
        R.propEq('type', 'delete')
    )
);
var EXEC_OPTIONS = {
    maxBuffer: 2000 * 1024
};

var errorHandle = err => {
    if (err) {
        console.log('ERROR: ', err);
        process.exit(1);
    }
};

var successHandle = () => process.exit(0);
var filterLines = R.over(
    R.lensProp('lines'), R.filter(
        R.either(
            R.propEq('add', true),
            R.propEq('del', true)
        )
    )
);
var mapFiles = R.map(
    R.pipe(
        filterLines,
        file => ({ path: file.to, lines: file.lines })
    )
);
var makeJestCommand = R.pipe(
    R.map(
        R.pipe(
            R.prop('path'),
            filePath => path.join(path.dirname(filePath), '__tests__')
        )
    ),
    R.concat(['node', './node_modules/jest-cli/bin/jest.js', '--coverage']),
    R.join(' ')
);

var reportToMap = R.pipe(
    R.values,
    R.map(info => [path.relative(path.resolve('./'), info.path), info.l]),
    R.fromPairs
);
var processLines = R.pipe(R.map(R.prop('ln')), R.uniq);

var makeCoverageReportForFile = (type, lines, lineCoverage) => {
    var allLines = processLines(lines);

    if (lineCoverage) {
        var uncoveredLines = R.filter(ln => lineCoverage[ln] === 0, allLines);

        return {
            type,
            countAll: allLines.length,
            uncovered: uncoveredLines,
            uncoveredCount: uncoveredLines.length,
            rate: allLines.length ? Math.round((allLines.length - uncoveredLines.length) / allLines.length * 100) : 100
        };
    } else {
        return {
            type,
            countAll: allLines.length,
            uncovered: allLines,
            uncoveredCount: allLines.length,
            rate: 0
        };
    }
};

var mergeFilesWithCoverage = (files, coverage) => R.fromPairs(
    R.map(
        file => [file.path, makeCoverageReportForFile(
            file.type,
            file.lines,
            coverage[file.path]
        )],
        files
    )
);

var joinUncoveredLines = R.pipe(
    R.splitEvery(15),
    R.map(R.join(', ')),
    R.join(endOfLine)
);

var isUncovered = R.propSatisfies(R.gt(THRESHOLD), 'rate');
var filterUncovered = R.filter(isUncovered);
var filterUncoveredAndAdd = R.filter(
    R.both(
        isUncovered,
        R.propEq('type', 'add')
    )
);
var reportToTableLines = R.pipe(
    R.toPairs,
    R.sortBy(R.path([1, 'rate'])),
    R.map(pair => {
        var file = pair[0],
            info = pair[1];

        return [
            file,
            info.type.toUpperCase(),
            `${info.rate} %`,
            info.countAll,
            info.uncoveredCount,
            info.type === 'add' && info.countAll === info.uncoveredCount ?
                'ALL' :
                joinUncoveredLines(info.uncovered)
        ];
    })
);

var generateTable = report => {
    var table = new Table({
        head: ['File', 'Type', 'Rate', 'Changed lines count', 'Uncovered lines count', 'Uncovered lines']
    });

    reportToTableLines(report).forEach(line => table.push(line));
    return table.toString();
};

var toBash = cmdStr => `bash -c "${cmdStr}"`;
var joinNotEmpty = R.pipe(R.reject(R.not), R.join(' '));
var diffCmd = (flag, files) => toBash(joinNotEmpty(['git diff', flag, '$(git merge-base origin/develop HEAD)..HEAD'].concat(files)));
var TYPE_MAP = {
    A: 'add',
    M: 'changed',
    D: 'delete'
};
var parseDiffFiles = R.pipe(
  R.split(/\n/),
  R.reject(R.not),
  R.map(
    R.pipe(
      R.splitAt(1),
      R.map(R.trim),
      file => ({ type: TYPE_MAP[file[0]], path: file[1] })
    )
  )
);
var filesName = R.map(R.prop('path'));
var filesType = R.pipe(
    R.map(R.props(['path', 'type'])),
    R.fromPairs
);

exec(diffCmd('--name-status'), (errorNameStatus, diffFiles) => {
    errorHandle(errorNameStatus);
    var files = filesForCover(parseDiffFiles(diffFiles));

    if (files.length) {
        exec(diffCmd('', filesName(files)), EXEC_OPTIONS, (errorDiff, stdout) => {
            errorHandle(errorDiff);
            var data = parse(stdout);
            var mapFileToType = filesType(files);
            var filesWithDiff = R.map(file => R.assoc('type', mapFileToType[file.path], file), mapFiles(data));


            exec(makeJestCommand(files), EXEC_OPTIONS, errorJest => {
                errorHandle(errorJest);
                var finalCoverageReport = JSON.parse(fs.readFileSync('./coverage/coverage-final.json', 'utf8'));

                var coverageMap = reportToMap(finalCoverageReport);
                var withCoverage = mergeFilesWithCoverage(filesWithDiff, coverageMap);
                var uncovered = (NEW_ONLY ? filterUncoveredAndAdd : filterUncovered)(withCoverage);

                if (R.keys(uncovered).length) {
                    console.log(generateTable(uncovered));
                    errorHandle('UNCOVERED: found uncovered files. Fix this ^');
                } else {
                    successHandle();
                }
            });
        });
    } else {
        successHandle();
    }
});

