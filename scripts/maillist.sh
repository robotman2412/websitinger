#!/bin/bash

if [ "$*" = "" ]; then
	echo "Error: No lists specified."
	echo "Use '--help' for more info."
	exit 2
fi

# Valid lists.
VALID="blog event"

# Validity checker.
contains() {
	[[ $1 =~ (^|[[:space:]])$2($|[[:space:]]) ]]
}

LISTS=""

for i in $*; do
	case $i in
		# Parameters.
		-h|--help|-help|help)
			echo "$0 -- Collect mailinglist"
			echo "Parameters specify which lists to use."
			echo "If 'all' is specified, all addresses are selected."
			echo
			echo "Valid lists: $VALID"
			exit 1
			;;
		-*)
			echo "Error: Unknown parameter '$i'"
			echo "Use '--help' for more info."
			exit 3
			;;
		# Mail to all lists.
		all)
			LISTS="$VALID"
			;;
		# Lists.
		*)
			if contains "$VALID" "$i"; then
				LISTS="$LISTS $i"
			else
				echo "Error: $i: Not a valid mailing list."
			fi
			;;
	esac
done

# Create condition.
COND=""
for i in $LISTS; do
	COND="$COND OR mail_$i"
done
COND=$(echo "$COND" | sed -e "s|^ OR ||")

# Extract database info.
psql -U php -d test -c "SELECT email FROM mailinglist WHERE $COND;" 2>/dev/null | tail -n +3 | head -n -2
