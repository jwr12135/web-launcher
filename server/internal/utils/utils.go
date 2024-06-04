package utils

import "regexp"

var RegexpUsername = regexp.MustCompile(`^\w+$`)
var RegexpUsernameStrict = regexp.MustCompile(`^[\dA-Za-z]\w{3,31}$`)
