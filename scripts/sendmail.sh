#!/bin/bash

NAME="$0"

show_help() {
	echo "$NAME -- Send a file to mailing lists."
	echo "Required parameters:"
	echo "  --to=...      The email addresses to send to."
	echo "  --subject=... The email's subject."
	echo "  --file=...    The file to send."
	echo "Optional parameters:"
	echo "  --preproc     File will be preprocessed before sending."
}

opt_preproc=0
opt_to=""
opt_subj=""
opt_file=""

# Read parameters.
for i in $*; do
	case $i in
		-h|--help)
			show_help
			exit 1
			;;
		--subject=*|--subj=*)
			opt_subj="${i#*=}"
			;;
		--file=*)
			opt_file="${i#*=}"
			;;
		--to=*)
			opt_to="${i#*=}"
			;;
		--preprocess|--pre|--preproc)
			opt_preproc=1
			;;
	esac
done

# Double-check options.
error=0
if [[ "$opt_to" = "" ]]; then
	echo "Error: Missing or empty --to parameter."
	error=1
fi
if [[ "$opt_subj" = "" ]]; then
	echo "Error: Missing or empty --subj parameter."
	error=1
fi
if [[ "$opt_file" = "" ]]; then
	echo "Error: Missing or empty --file parameter."
	error=1
elif [[ ! -f "$opt_file" ]]; then
	echo "Error: '$opt_file' must be a regular file."
	error=1
fi
if [[ "$error" = 1 ]]; then
	show_help
	exit 2
fi

# Preprocess files.
if [[ $opt_preproc = 1 ]]; then
	tmpfile="/tmp/mail_preproc"
	./mailpreproc.py "$opt_file" "$tmpfile"
	opt_file="$tmpfile"
fi

# Count the number of recipients.
let NUM_TOTAL=$(echo "$opt_to" | wc -w)
echo "Delivering $NUM_TOTAL email(s)..."
for i in $opt_to; do
	echo "Sending to $i..."
	cat "$opt_file" | mail -a 'Content-Type: text/html; charset=UTF-8'\
		-a FROM:julian@scheffers.net -A "/var/www/html/i/robotman2412.png"\
		-s "$opt_subj" "$i"
done
echo "Done!"
