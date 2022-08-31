## Performance Testing on Rokomari Web Application Using JMeter

Test executed for the below mentioned scenario in server https://en.wikipedia.org/wiki/Main_Page.

- 20 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 6.30 And Total Concurrent API requested: 1940.
- 25 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 5.99 And Total Concurrent API requested: 2425.
- 30 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 5.64 And Total Concurrent API requested: 2910.
- 40 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 14.57 And Total Concurrent API requested: 3880.
- 50 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 4.24 And Total Concurrent API requested: 4850.

While executed 2425 concurrent request, found 16 request got connection timeout and error rate is 0.66%. 

**Summary:** Server can handle almost concurrent 1940 API call with almost zero (0) percent error rate.

Please find the details report from the attachment and let me know if you have any further queries.
